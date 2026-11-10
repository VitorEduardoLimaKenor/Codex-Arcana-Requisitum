import { test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp, distance, PRESENCE_MS } from "./server.mjs";
async function harness(t, dbPath, now) {
  const app = createApp({ dbPath, ...(now ? { now } : {}) });
  app.server.listen(0, "127.0.0.1");
  await once(app.server, "listening");
  t.after(() => {
    app.server.closeAllConnections();
    app.server.close();
    app.db.close();
  });
  const base = `http://127.0.0.1:${app.server.address().port}`;
  return {
    app,
    async call(method, path, user, data) {
      const response = await fetch(base + path, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(user ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: data === undefined ? undefined : JSON.stringify(data),
      });
      return { status: response.status, data: await response.json() };
    },
    async signup(name, role) {
      const response = await fetch(base + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: `${name}@example.test`,
          password: "TesteSala123",
          role,
        }),
      });
      assert.equal(response.status, 200);
      return response.json();
    },
  };
}
test("aventura multiusuário: GPS, lobby, limites, permissões, conflitos e saída", async (t) => {
  const { call, signup } = await harness(t);
  const master = await signup("mestre", "master");
  const other = await signup("outromestre", "master");
  const a = await signup("alunoA", "player");
  const b = await signup("alunoB", "player");
  const c = await signup("alunoC", "player");
  const coords = {
    latitude: -23.55,
    longitude: -46.63,
    accuracy: 5,
    timestamp: Date.now(),
  };
  assert.equal((await call("POST", "/rooms", a, { ...coords })).status, 403);
  assert.equal(
    (
      await call("POST", "/rooms", master, {
        ...coords,
        name: "Inválida",
        description: "",
        capacity: 10,
        groupCount: 1,
        groupSize: 2,
        radius: 30,
      })
    ).status,
    400,
  );
  let response = await call("POST", "/rooms", master, {
    ...coords,
    name: "Biblioteca",
    description: "Requisitos",
    capacity: 2,
    groupCount: 2,
    groupSize: 1,
    radius: 30,
  });
  assert.equal(response.status, 201);
  let room = response.data;
  const id = room.id;
  assert.equal((await call("GET", `/rooms/${id}`, c)).status, 403);
  assert.equal(
    (await call("POST", "/rooms/nearby", a, { latitude: 0, longitude: 0 })).data
      .length,
    0,
  );
  response = await call("POST", "/rooms/nearby", a, coords);
  assert.equal(response.data[0].id, id);
  assert.equal("latitude" in response.data[0], false);
  response = await call("GET", `/rooms/${id}`, master);
  assert.equal(
    response.data.seekers.some((p) => p.id === a.id),
    true,
  );
  assert.equal("latitude" in response.data.seekers[0], false);
  assert.equal(
    (
      await call("POST", `/rooms/${id}/join`, a, {
        ...coords,
        latitude: 0,
        longitude: 0,
      })
    ).status,
    403,
  );
  response = await call("POST", `/rooms/${id}/join`, a, coords);
  assert.equal(response.status, 200);
  room = response.data;
  assert.equal(room.members[0].groupNo, null);
  assert.equal("seekers" in room, false);
  assert.equal(
    (
      await call("POST", `/rooms/${id}/assign`, a, {
        userId: a.id,
        groupNo: 1,
        version: room.version,
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await call("POST", `/rooms/${id}/assign`, other, {
        userId: a.id,
        groupNo: 1,
        version: room.version,
      })
    ).status,
    403,
  );
  response = await call("POST", `/rooms/${id}/assign`, master, {
    userId: a.id,
    groupNo: 1,
    version: room.version,
  });
  assert.equal(response.status, 200);
  const previousVersion = room.version;
  room = response.data;
  assert.equal(
    (
      await call("POST", `/rooms/${id}/status`, master, {
        status: "locked",
        version: previousVersion,
      })
    ).status,
    409,
  );
  const simultaneous = await Promise.all([
    call("POST", "/rooms/join-code", b, { code: room.code, ...coords }),
    call("POST", "/rooms/join-code", c, { code: room.code, ...coords }),
  ]);
  assert.deepEqual(simultaneous.map((r) => r.status).sort(), [200, 409]);
  const winner = simultaneous[0].status === 200 ? b : c;
  room = (await call("GET", `/rooms/${id}`, master)).data;
  assert.equal(room.count, 2);
  assert.equal(
    (
      await call("POST", `/rooms/${id}/assign`, master, {
        userId: winner.id,
        groupNo: 1,
        version: room.version,
      })
    ).status,
    409,
  );
  room = (
    await call("POST", `/rooms/${id}/assign`, master, {
      userId: winner.id,
      groupNo: 2,
      version: room.version,
    })
  ).data;
  assert.equal(
    (
      await call("POST", `/rooms/${id}/settings`, master, {
        capacity: 2,
        groupCount: 1,
        groupSize: 2,
        version: room.version,
      })
    ).status,
    409,
  );
  assert.equal(
    (
      await call("POST", `/rooms/${id}/settings`, a, {
        capacity: 2,
        groupCount: 2,
        groupSize: 1,
        version: room.version,
      })
    ).status,
    403,
  );
  room = (
    await call("POST", `/rooms/${id}/status`, master, {
      status: "closed",
      version: room.version,
    })
  ).data;
  assert.equal(
    (
      await call("POST", `/rooms/${id}/assign`, master, {
        userId: a.id,
        groupNo: null,
        version: room.version,
      })
    ).status,
    409,
  );
  assert.equal(
    (await call("POST", `/rooms/${id}/leave`, winner, {})).status,
    200,
  );
  assert.equal((await call("GET", `/rooms/${id}`, winner)).status, 403);
  assert.equal(
    (await call("GET", `/rooms/${id}`, a)).data.members[0].groupNo,
    1,
  );
  assert.equal((await call("POST", "/auth/logout", a, {})).status, 200);
  assert.equal((await call("GET", "/rooms", a)).status, 401);
});
test("dados permanecem em SQLite ao reiniciar o servidor", async (t) => {
  const dir = mkdtempSync(join(tmpdir(), "codex-rooms-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const path = join(dir, "test.db");
  const first = await harness(t, path);
  const master = await first.signup("persistente", "master");
  const room = (
    await first.call("POST", "/rooms", master, {
      name: "Aventura persistente",
      description: "",
      latitude: 0,
      longitude: 0,
      accuracy: 5,
      timestamp: Date.now(),
      capacity: 4,
      groupCount: 2,
      groupSize: 2,
      radius: 30,
    })
  ).data;
  await first.call("POST",`/rooms/${room.id}/rename-group`,master,{groupNo:1,name:"Mesa Persistente",version:room.version});
  const second = await harness(t, path);
  const snapshot = await second.call("GET", `/rooms/${room.id}`, master);
  assert.equal(snapshot.status, 200);
  assert.equal(snapshot.data.name, "Aventura persistente");
  assert.equal(snapshot.data.groups[0].name,"Mesa Persistente");
});
test("distância geográfica básica", () => {
  assert.equal(
    distance({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 0 }),
    0,
  );
  assert.ok(
    distance({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 1 }) >
      111000,
  );
});

test("código exige GPS próximo e preciso; nomes e movimentação são exclusivos do mestre", async (t) => {
  const { call, signup } = await harness(t);
  const master = await signup("professor", "master");
  const player = await signup("estudante", "player");
  const p = {
    latitude: -23.55,
    longitude: -46.63,
    accuracy: 5,
    timestamp: Date.now(),
  };
  let room = (
    await call("POST", "/rooms", master, {
      ...p,
      name: "Sala de aula",
      description: "",
      capacity: 4,
      groupCount: 2,
      groupSize: 2,
      radius: 30,
    })
  ).data;
  assert.equal(room.groups.length, 2);
  assert.equal(
    (await call("POST", "/rooms/join-code", player, { code: room.code }))
      .status,
    400,
  );
  assert.equal(
    (
      await call("POST", "/rooms/join-code", player, {
        ...p,
        latitude: 0,
        longitude: 0,
        code: room.code,
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await call("POST", "/rooms/join-code", player, {
        ...p,
        accuracy: 100,
        code: room.code,
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await call("POST", "/rooms/join-code", player, {
        ...p,
        timestamp: Date.now() - 120000,
        code: room.code,
      })
    ).status,
    400,
  );
  room = (
    await call("POST", "/rooms/join-code", player, { ...p, code: room.code })
  ).data;
  assert.equal(room.count, 1);
  assert.equal(
    (
      await call("POST", `/rooms/${room.id}/rename-group`, player, {
        groupNo: 1,
        name: "Hack",
        version: room.version,
      })
    ).status,
    403,
  );
  room = (
    await call("POST", `/rooms/${room.id}/rename-group`, master, {
      groupNo: 1,
      name: "Equipe Requisitos",
      version: room.version,
    })
  ).data;
  assert.equal(room.groups[0].name, "Equipe Requisitos");
  assert.equal(
    (
      await call("POST", `/rooms/${room.id}/rename-group`, master, {
        groupNo: 2,
        name: "equipe requisitos",
        version: room.version,
      })
    ).status,
    409,
  );
  room = (
    await call("POST", `/rooms/${room.id}/assign`, master, {
      userId: player.id,
      groupNo: 1,
      version: room.version,
    })
  ).data;
  room = (
    await call("POST", `/rooms/${room.id}/assign`, master, {
      userId: player.id,
      groupNo: 2,
      version: room.version,
    })
  ).data;
  assert.equal(room.members[0].groupNo, 2);
  const view = (await call("GET", `/rooms/${room.id}`, player)).data;
  assert.equal(view.groups[0].name, "Equipe Requisitos");
  assert.equal(view.members[0].groupNo, 2);
  room = (
    await call("POST", `/rooms/${room.id}/settings`, master, {
      capacity: 6,
      groupCount: 3,
      groupSize: 2,
      version: room.version,
    })
  ).data;
  assert.equal(room.groups[0].name, "Equipe Requisitos");
  assert.equal(room.groups[2].name, "Grupo 3");
});

test("sala só aceita jogadores com o mestre no lobby; mestre pode excluir a sala", async (t) => {
  let offset = 0;
  const clock = () => Date.now() + offset;
  const { call, signup } = await harness(t, undefined, clock);
  const master = await signup("mestra", "master");
  const player = await signup("aluna", "player");
  const outsider = await signup("outro", "master");
  const where = () => ({
    latitude: -23.55,
    longitude: -46.63,
    accuracy: 5,
    timestamp: clock(),
  });
  const room = (
    await call("POST", "/rooms", master, {
      ...where(),
      name: "Clínica sem Fila",
      description: "",
      capacity: 4,
      groupCount: 2,
      groupSize: 2,
      radius: 30,
    })
  ).data;
  assert.equal(room.masterOnline, true);

  // Mestre sai do lobby: a sala fecha na hora.
  assert.equal(
    (await call("POST", `/rooms/${room.id}/presence`, master, { present: false })).data
      .masterOnline,
    false,
  );
  assert.equal((await call("POST", "/rooms/nearby", player, where())).data.length, 0);
  const closed = await call("POST", "/rooms/join-code", player, { ...where(), code: room.code });
  assert.equal(closed.status, 409);
  assert.match(closed.data.error, /fechada/);

  // Mestre reabre (consulta o lobby): jogadores podem entrar.
  assert.equal((await call("GET", `/rooms/${room.id}`, master)).data.masterOnline, true);
  assert.equal((await call("POST", "/rooms/nearby", player, where())).data.length, 1);
  assert.equal(
    (await call("POST", "/rooms/join-code", player, { ...where(), code: room.code })).status,
    200,
  );

  // Sem notícias do mestre por PRESENCE_MS, a sala fecha sozinha.
  offset += PRESENCE_MS + 1000;
  assert.equal((await call("GET", "/rooms", player)).data[0].masterOnline, false);

  // Só o mestre da sala exclui; depois disso ela some para todos.
  assert.equal((await call("DELETE", `/rooms/${room.id}`, outsider)).status, 403);
  assert.equal((await call("DELETE", `/rooms/${room.id}`, player)).status, 403);
  assert.equal((await call("DELETE", `/rooms/${room.id}`, master)).status, 200);
  assert.equal((await call("GET", `/rooms/${room.id}`, player)).status, 404);
  assert.equal((await call("GET", "/rooms", master)).data.length, 0);
});

test("jogador entra com o personagem escolhido e pode trocá-lo", async (t) => {
  const { call, signup } = await harness(t);
  const master = await signup("mestre2", "master");
  const player = await signup("jogadora2", "player");
  const where = () => ({ latitude: -23.55, longitude: -46.63, accuracy: 5, timestamp: Date.now() });
  const room = (
    await call("POST", "/rooms", master, {
      ...where(), name: "Bandejão Digital", description: "", capacity: 4, groupCount: 2, groupSize: 2,
    })
  ).data;
  assert.equal(room.radius, 100, "raio padrão de 100 m");
  const bad = await call("POST", "/rooms/join-code", player, {
    ...where(), code: room.code, hero: { name: "Theo", classId: "mago" },
  });
  assert.equal(bad.status, 400);
  const theo = { name: "Theo, o Estrategista", classId: "business", templateId: "hero-5" };
  const joined = await call("POST", "/rooms/join-code", player, { ...where(), code: room.code, hero: theo });
  assert.equal(joined.status, 200);
  assert.deepEqual(joined.data.members[0].hero, theo);
  const lia = { name: "Lia, a Investigadora", classId: "requirements", templateId: "hero-0" };
  await call("POST", "/rooms/join-code", player, { ...where(), code: room.code, hero: lia });
  const seen = (await call("GET", `/rooms/${room.id}`, master)).data;
  assert.equal(seen.members.length, 1, "trocar de personagem não duplica a vaga");
  assert.deepEqual(seen.members[0].hero, lia);
});
