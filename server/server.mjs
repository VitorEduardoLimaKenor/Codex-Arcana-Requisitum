import { createServer } from "node:http";
import { DatabaseSync } from "node:sqlite";
import {
  randomUUID,
  randomBytes,
  scrypt,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { promisify } from "node:util";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
const derive = promisify(scrypt);
/** Tempo sem notícias do mestre até a sala fechar (o lobby consulta a cada 3 s). */
export const PRESENCE_MS = 15000;
const fail = (status, message) => {
  throw Object.assign(new Error(message), { status });
};
const text = (v, min, max, label) => {
  if (typeof v !== "string" || v.trim().length < min || v.trim().length > max)
    fail(400, `${label} inválido.`);
  return v.trim();
};
const CLASS_IDS = ["requirements", "developer", "business", "designer", "quality"];
/** Personagem com que o jogador entra na sala (a ficha fica no aparelho). */
function heroFrom(v) {
  if (v === undefined || v === null) return null;
  if (typeof v !== "object") fail(400, "Personagem inválido.");
  const name = text(v.name, 1, 60, "Nome do personagem");
  if (!CLASS_IDS.includes(v.classId)) fail(400, "Classe do personagem inválida.");
  if (v.templateId !== undefined && !/^hero-\d{1,2}$/.test(v.templateId))
    fail(400, "Modelo do personagem inválido.");
  return JSON.stringify({ name, classId: v.classId, templateId: v.templateId });
}
const parseHero = (raw) => {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const integer = (v, min, max, label) => {
  if (!Number.isInteger(v) || v < min || v > max)
    fail(400, `${label}: use um número de ${min} a ${max}.`);
  return v;
};
function position(body) {
  const { latitude, longitude } = body ?? {};
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  )
    fail(400, "Localização inválida.");
  return { latitude, longitude };
}
export function distance(a, b) {
  const rad = (n) => (n * Math.PI) / 180;
  const x =
    Math.sin(rad(b.latitude - a.latitude) / 2) ** 2 +
    Math.cos(rad(a.latitude)) *
      Math.cos(rad(b.latitude)) *
      Math.sin(rad(b.longitude - a.longitude) / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(Math.max(0, 1 - x)));
}
function limits(b) {
  const capacity = integer(b.capacity, 1, 100, "Total de jogadores");
  const groupCount = integer(b.groupCount, 1, 20, "Quantidade de grupos");
  const groupSize = integer(b.groupSize, 1, 20, "Pessoas por grupo");
  if (capacity > groupCount * groupSize)
    fail(400, "Os grupos não têm vagas suficientes para o total de jogadores.");
  return { capacity, groupCount, groupSize };
}
const tokenHash = (token) => createHash("sha256").update(token).digest("hex");
export function createApp({
  dbPath = ":memory:",
  now = () => Date.now(),
} = {}) {
  if (dbPath !== ":memory:")
    mkdirSync(dirname(resolve(dbPath)), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;
 CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('master','player')),salt TEXT NOT NULL,hash TEXT NOT NULL, UNIQUE(email,role));
 CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),expires INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS rooms(id TEXT PRIMARY KEY,master_id TEXT NOT NULL REFERENCES users(id),name TEXT NOT NULL,description TEXT NOT NULL,code TEXT NOT NULL UNIQUE,capacity INTEGER NOT NULL,group_count INTEGER NOT NULL,group_size INTEGER NOT NULL,radius INTEGER NOT NULL,latitude REAL NOT NULL,longitude REAL NOT NULL,status TEXT NOT NULL DEFAULT 'open',version INTEGER NOT NULL DEFAULT 1,created INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS members(room_id TEXT NOT NULL REFERENCES rooms(id),user_id TEXT NOT NULL REFERENCES users(id),group_no INTEGER,joined INTEGER NOT NULL,PRIMARY KEY(room_id,user_id));
 CREATE TABLE IF NOT EXISTS seeking(user_id TEXT PRIMARY KEY REFERENCES users(id),latitude REAL NOT NULL,longitude REAL NOT NULL,updated INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS room_groups(room_id TEXT NOT NULL REFERENCES rooms(id),number INTEGER NOT NULL,name TEXT NOT NULL,PRIMARY KEY(room_id,number));
 CREATE INDEX IF NOT EXISTS members_user ON members(user_id); CREATE INDEX IF NOT EXISTS rooms_master ON rooms(master_id);`);
  const get = (sql, ...p) => db.prepare(sql).get(...p);
  const all = (sql, ...p) => db.prepare(sql).all(...p);
  const run = (sql, ...p) => db.prepare(sql).run(...p);
  // Presença do mestre: a sala só aceita jogadores enquanto ele está no lobby.
  if (!all("PRAGMA table_info(members)").some((c) => c.name === "hero"))
    run("ALTER TABLE members ADD COLUMN hero TEXT");
  if (!all("PRAGMA table_info(rooms)").some((c) => c.name === "master_seen"))
    run("ALTER TABLE rooms ADD COLUMN master_seen INTEGER NOT NULL DEFAULT 0");
  const masterOnline = (r) => now() - r.master_seen < PRESENCE_MS;
  const seen = (u, r) => {
    if (r.master_id === u.id)
      run("UPDATE rooms SET master_seen=? WHERE id=?", now(), r.id);
  };
  run(
    "UPDATE rooms SET radius=100,version=version+1 WHERE radius>100 OR radius<10",
  );
  for (const r of all("SELECT id,group_count FROM rooms"))
    syncGroups(r.id, r.group_count);
  const userView = (u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
  });
  const master = (u, r) => {
    if (u.role !== "master" || r.master_id !== u.id)
      fail(403, "Somente o mestre desta sala pode alterar a formação.");
  };
  const room = (id) => {
    const r = get("SELECT * FROM rooms WHERE id=?", id);
    if (!r) fail(404, "Sala não encontrada.");
    return r;
  };
  const readable = (u, r) => {
    if (
      r.master_id !== u.id &&
      !get("SELECT 1 FROM members WHERE room_id=? AND user_id=?", r.id, u.id)
    )
      fail(403, "Entre no lobby para visualizar os grupos.");
  };
  function freshPosition(body, radius) {
    const p = position(body);
    if (
      !Number.isFinite(body.accuracy) ||
      body.accuracy < 0 ||
      body.accuracy > radius
    )
      fail(
        400,
        "A precisão do GPS não é suficiente para esta sala. Ative a localização precisa e tente novamente.",
      );
    if (
      !Number.isFinite(body.timestamp) ||
      now() - body.timestamp > 60000 ||
      body.timestamp - now() > 30000
    )
      fail(400, "Atualize sua localização para entrar na sala.");
    return p;
  }
  function classroomPosition(u, r, body) {
    if (u.role !== "player") fail(403, "Somente jogadores entram no lobby.");
    const p = freshPosition(body, r.radius);
    if (distance(p, r) > r.radius)
      fail(
        403,
        "Você precisa estar no raio da sala de aula para entrar, inclusive por código.",
      );
  }
  function syncGroups(id, count) {
    for (let n = 1; n <= count; n++)
      run(
        "INSERT OR IGNORE INTO room_groups VALUES(?,?,?)",
        id,
        n,
        `Grupo ${n}`,
      );
    run("DELETE FROM room_groups WHERE room_id=? AND number>?", id, count);
  }
  function summary(r) {
    return {
      id: r.id,
      name: r.name,
      description: r.description,
      masterName: get("SELECT name FROM users WHERE id=?", r.master_id).name,
      masterId: r.master_id,
      capacity: r.capacity,
      groupCount: r.group_count,
      groupSize: r.group_size,
      radius: r.radius,
      status: r.status,
      masterOnline: masterOnline(r),
      version: r.version,
      count: get("SELECT count(*) n FROM members WHERE room_id=?", r.id).n,
    };
  }
  function snapshot(u, r) {
    readable(u, r);
    const result = {
      ...summary(r),
      code: r.code,
      groups: all(
        "SELECT number,name FROM room_groups WHERE room_id=? ORDER BY number",
        r.id,
      ),
      members: all(
        "SELECT u.id,u.name,m.group_no AS groupNo,m.hero FROM members m JOIN users u ON u.id=m.user_id WHERE m.room_id=? ORDER BY m.joined,u.id",
        r.id,
      ).map((m) => ({ ...m, hero: parseHero(m.hero) })),
    };
    if (r.master_id === u.id)
      result.seekers = all(
        "SELECT u.id,u.name,s.latitude,s.longitude FROM seeking s JOIN users u ON u.id=s.user_id WHERE s.updated>? AND NOT EXISTS(SELECT 1 FROM members m WHERE m.room_id=? AND m.user_id=u.id)",
        now() - 120000,
        r.id,
      )
        .map((s) => ({
          id: s.id,
          name: s.name,
          distance: Math.round(distance(r, s)),
        }))
        .filter((s) => s.distance <= r.radius);
    return result;
  }
  function revision(r, b) {
    if (b.version !== r.version)
      fail(409, "A sala mudou. Atualize a formação e tente novamente.");
  }
  function bump(id) {
    run("UPDATE rooms SET version=version+1 WHERE id=?", id);
  }
  async function handler(req, res) {
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": process.env.WEB_ORIGIN ?? "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    };
    const send = (status, data) => {
      res.writeHead(status, headers);
      res.end(JSON.stringify(data));
    };
    try {
      if (req.method === "OPTIONS") {
        send(204, {});
        return;
      }
      const url = new URL(req.url, "http://localhost");
      let body = {};
      if (["POST", "PATCH"].includes(req.method)) {
        let raw = "";
        for await (const chunk of req) {
          raw += chunk;
          if (Buffer.byteLength(raw) > 16384) fail(413, "Dados muito grandes.");
        }
        try {
          body = JSON.parse(raw || "{}");
        } catch {
          fail(400, "JSON inválido.");
        }
        if (!body || Array.isArray(body) || typeof body !== "object")
          fail(400, "JSON inválido.");
      }
      const path = url.pathname;
      if (path === "/health") {
        send(200, { ok: true });
        return;
      }
      if (path === "/auth/register" || path === "/auth/login") {
        if (req.method !== "POST") fail(405, "Método inválido.");
        const email = text(body.email, 3, 254, "E-mail").toLowerCase();
        const password = typeof body.password === "string" ? body.password : "";
        if (password.length < 8 || password.length > 128)
          fail(400, "Use uma senha entre 8 e 128 caracteres.");
        if (!["master", "player"].includes(body.role))
          fail(400, "Perfil inválido.");
        let u = get(
          "SELECT * FROM users WHERE email=? AND role=?",
          email,
          body.role,
        );
        if (path.endsWith("register")) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            fail(400, "E-mail inválido.");
          if (u) fail(409, "Esta conta já existe neste perfil. Use Entrar.");
          const name = text(body.name, 2, 60, "Nome");
          const salt = randomBytes(16).toString("hex");
          const hash = (await derive(password, salt, 32)).toString("hex");
          u = { id: randomUUID(), name, email, role: body.role, salt, hash };
          try {
            run(
              "INSERT INTO users VALUES(?,?,?,?,?,?)",
              u.id,
              name,
              email,
              u.role,
              salt,
              hash,
            );
          } catch (e) {
            if (e.code?.startsWith("ERR_SQLITE"))
              fail(409, "Esta conta já existe. Use Entrar.");
            throw e;
          }
        } else {
          if (!u) fail(401, "E-mail ou senha incorretos para este perfil.");
          const hash = await derive(password, u.salt, 32);
          if (!timingSafeEqual(hash, Buffer.from(u.hash, "hex")))
            fail(401, "E-mail ou senha incorretos para este perfil.");
        }
        run("DELETE FROM sessions WHERE expires<?", now());
        const token = randomBytes(32).toString("hex");
        run(
          "INSERT INTO sessions VALUES(?,?,?)",
          tokenHash(token),
          u.id,
          now() + 12 * 60 * 60 * 1000,
        );
        send(200, { ...userView(u), token });
        return;
      }
      const token = (req.headers.authorization ?? "").replace(/^Bearer /, "");
      const u = get(
        "SELECT u.* FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token=? AND s.expires>?",
        tokenHash(token),
        now(),
      );
      if (!u) fail(401, "Entre novamente para acessar as salas.");
      if (path === "/auth/logout" && req.method === "POST") {
        run("DELETE FROM sessions WHERE token=?", tokenHash(token));
        send(200, { ok: true });
        return;
      }
      if (path === "/seeking" && req.method === "DELETE") {
        run("DELETE FROM seeking WHERE user_id=?", u.id);
        send(200, { ok: true });
        return;
      }
      if (path === "/rooms" && req.method === "GET") {
        const mine = all(
          "SELECT DISTINCT r.* FROM rooms r LEFT JOIN members m ON m.room_id=r.id WHERE r.master_id=? OR m.user_id=? ORDER BY r.created DESC",
          u.id,
          u.id,
        );
        send(200, mine.map(summary));
        return;
      }
      if (path === "/rooms/nearby" && req.method === "POST") {
        if (u.role !== "player")
          fail(403, "A busca é destinada aos jogadores.");
        const p = position(body);
        run(
          "INSERT INTO seeking VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET latitude=excluded.latitude,longitude=excluded.longitude,updated=excluded.updated",
          u.id,
          p.latitude,
          p.longitude,
          now(),
        );
        const rooms = all("SELECT * FROM rooms WHERE status='open'")
          .filter(masterOnline)
          .map((r) => ({ ...summary(r), distance: Math.round(distance(p, r)) }))
          .filter((r) => r.distance <= r.radius && r.count < r.capacity);
        send(
          200,
          rooms.sort((a, b) => a.distance - b.distance),
        );
        return;
      }
      if (path === "/rooms" && req.method === "POST") {
        if (u.role !== "master") fail(403, "Somente mestres criam aventuras.");
        const p = position(body);
        const l = limits(body);
        const name = text(body.name, 3, 100, "Nome da aventura");
        const description = text(body.description ?? "", 0, 1000, "Descrição");
        // O app usa um raio padrão de 100 m (uma sala de aula e arredores).
        const radius = integer(body.radius ?? 100, 10, 100, "Raio em metros");
        freshPosition(body, radius);
        const id = randomUUID();
        let code;
        do {
          code = randomBytes(4).toString("hex").slice(0, 6).toUpperCase();
        } while (get("SELECT 1 FROM rooms WHERE code=?", code));
        run(
          "INSERT INTO rooms(id,master_id,name,description,code,capacity,group_count,group_size,radius,latitude,longitude,created,master_seen) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
          id,
          u.id,
          name,
          description,
          code,
          l.capacity,
          l.groupCount,
          l.groupSize,
          radius,
          p.latitude,
          p.longitude,
          now(),
          now(),
        );
        syncGroups(id, l.groupCount);
        send(201, snapshot(u, room(id)));
        return;
      }
      if (path === "/rooms/join-code" && req.method === "POST") {
        const code = text(body.code, 6, 6, "Código").toUpperCase();
        const r = get("SELECT * FROM rooms WHERE code=?", code);
        if (!r) fail(404, "Código de sala não encontrado.");
        classroomPosition(u, r, body);
        join(u, r, body);
        send(200, snapshot(u, room(r.id)));
        return;
      }
      const match = path.match(
        /^\/rooms\/([a-f0-9-]+)(?:\/(join|assign|rename-group|leave|remove|settings|status|presence))?$/,
      );
      if (!match) fail(404, "Recurso não encontrado.");
      let r = room(match[1]);
      const action = match[2];
      if (action === "presence" && req.method === "POST") {
        master(u, r);
        // O mestre saiu do lobby: fecha a entrada imediatamente.
        run(
          "UPDATE rooms SET master_seen=? WHERE id=?",
          body.present === false ? 0 : now(),
          r.id,
        );
        send(200, summary(room(r.id)));
        return;
      }
      if (!action && req.method === "DELETE") {
        master(u, r);
        run("DELETE FROM members WHERE room_id=?", r.id);
        run("DELETE FROM room_groups WHERE room_id=?", r.id);
        run("DELETE FROM rooms WHERE id=?", r.id);
        send(200, { ok: true });
        return;
      }
      seen(u, r);
      r = room(r.id);
      if (!action && req.method === "GET") {
        send(200, snapshot(u, r));
        return;
      }
      if (req.method !== "POST") fail(405, "Método inválido.");
      if (action === "join") {
        classroomPosition(u, r, body);
        join(u, r, body);
      } else if (action === "leave") {
        if (u.role !== "player") fail(403, "Somente jogadores saem do lobby.");
        run("DELETE FROM members WHERE room_id=? AND user_id=?", r.id, u.id);
        bump(r.id);
        send(200, { ok: true });
        return;
      } else {
        master(u, r);
        revision(r, body);
        if (action === "assign") {
          if (r.status === "closed") fail(409, "Esta aventura está encerrada.");
          const groupNo =
            body.groupNo === null
              ? null
              : integer(body.groupNo, 1, r.group_count, "Grupo");
          if (
            !get(
              "SELECT 1 FROM members WHERE room_id=? AND user_id=?",
              r.id,
              body.userId,
            )
          )
            fail(404, "Participante não encontrado.");
          if (
            groupNo !== null &&
            get(
              "SELECT count(*) n FROM members WHERE room_id=? AND group_no=? AND user_id<>?",
              r.id,
              groupNo,
              body.userId,
            ).n >= r.group_size
          )
            fail(409, "Este grupo está cheio.");
          run(
            "UPDATE members SET group_no=? WHERE room_id=? AND user_id=?",
            groupNo,
            r.id,
            body.userId,
          );
        } else if (action === "remove") {
          run(
            "DELETE FROM members WHERE room_id=? AND user_id=?",
            r.id,
            typeof body.userId === "string" ? body.userId : "",
          );
        } else if (action === "rename-group") {
          if (r.status === "closed")
            fail(409, "Reabra a aventura para editar os grupos.");
          const number = integer(body.groupNo, 1, r.group_count, "Grupo");
          const name = text(body.name, 2, 40, "Nome do grupo").replace(
            /\s+/g,
            " ",
          );
          if (
            all(
              "SELECT number,name FROM room_groups WHERE room_id=?",
              r.id,
            ).some(
              (g) =>
                g.number !== number &&
                g.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
            )
          )
            fail(409, "Já existe um grupo com esse nome nesta aventura.");
          run(
            "UPDATE room_groups SET name=? WHERE room_id=? AND number=?",
            name,
            r.id,
            number,
          );
        } else if (action === "settings") {
          const l = limits(body);
          if (
            get("SELECT count(*) n FROM members WHERE room_id=?", r.id).n >
              l.capacity ||
            get(
              "SELECT 1 FROM members WHERE room_id=? AND group_no>?",
              r.id,
              l.groupCount,
            ) ||
            get(
              "SELECT 1 FROM members WHERE room_id=? GROUP BY group_no HAVING group_no IS NOT NULL AND count(*)>?",
              r.id,
              l.groupSize,
            )
          )
            fail(
              409,
              "Os novos limites não comportam os participantes atuais.",
            );
          run(
            "UPDATE rooms SET capacity=?,group_count=?,group_size=? WHERE id=?",
            l.capacity,
            l.groupCount,
            l.groupSize,
            r.id,
          );
          syncGroups(r.id, l.groupCount);
        } else if (action === "status") {
          if (!["open", "locked", "closed"].includes(body.status))
            fail(400, "Status inválido.");
          run("UPDATE rooms SET status=? WHERE id=?", body.status, r.id);
        } else fail(404, "Ação não encontrada.");
        bump(r.id);
      }
      send(200, snapshot(u, room(r.id)));
    } catch (e) {
      if (!res.headersSent)
        send(e.status ?? 500, {
          error: e.status ? e.message : "Não foi possível concluir a operação.",
        });
    }
  }
  function join(u, r, body = {}) {
    if (u.role !== "player") fail(403, "Somente jogadores entram no lobby.");
    const hero = heroFrom(body.hero);
    if (get("SELECT 1 FROM members WHERE room_id=? AND user_id=?", r.id, u.id)) {
      // Já está na sala: entrar de novo só troca o personagem.
      if (hero) {
        run("UPDATE members SET hero=? WHERE room_id=? AND user_id=?", hero, r.id, u.id);
        bump(r.id);
      }
      return;
    }
    if (r.status !== "open")
      fail(409, "As entradas desta sala estão fechadas.");
    if (!masterOnline(r))
      fail(409, "A sala está fechada. Aguarde o mestre abrir o lobby.");
    if (
      get("SELECT count(*) n FROM members WHERE room_id=?", r.id).n >=
      r.capacity
    )
      fail(409, "Esta sala está cheia.");
    run(
      "INSERT INTO members(room_id,user_id,group_no,joined,hero) VALUES(?,?,NULL,?,?)",
      r.id,
      u.id,
      now(),
      hero,
    );
    run("DELETE FROM seeking WHERE user_id=?", u.id);
    bump(r.id);
  }
  const server = createServer(handler);
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  return { server, db };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const { server } = createApp({
    dbPath: process.env.SERVER_DB ?? "server/data/codex.db",
  });
  server.listen(Number(process.env.PORT ?? 3001), "0.0.0.0", () =>
    console.log(`Servidor Codex: porta ${process.env.PORT ?? 3001}`),
  );
}
