import { networkInterfaces } from "node:os";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
const addresses = Object.values(networkInterfaces())
  .flat()
  .filter((a) => a.family === "IPv4" && !a.internal);
const host =
  process.argv[2] ??
  addresses.find((a) => /^(192\.168\.|10\.)/.test(a.address))?.address ??
  addresses[0]?.address;
if (!host)
  throw Error(
    "Não foi encontrado um endereço de rede. Execute npm run server:configure -- IP_DO_COMPUTADOR.",
  );
const file = ".env.local";
const previous = existsSync(file) ? readFileSync(file, "utf8") : "";
writeFileSync(
  file,
  previous.replace(/^EXPO_PUBLIC_API_URL=.*\n?/gm, "").trimEnd() +
    `\nEXPO_PUBLIC_API_URL=http://${host}:3001\n`,
);
console.log(
  `API configurada em http://${host}:3001. Inicie npm run server e reinicie o Expo com npx expo start --clear.`,
);
