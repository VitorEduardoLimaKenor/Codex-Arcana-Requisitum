# Codex Arcana Mobile

**Trabalho Prático 2 · Integração Mobile · Desenvolvimento de Aplicações para Dispositivos Móveis**

![Livro luminoso do Codex Arcana em um fundo violeta e ciano](assets/images/codex-banner.png)

Aplicativo de apoio ao **Codex Arcana**, um RPG de mesa para ensinar **Engenharia de Requisitos**. O jogador escolhe um personagem, entra na sala da turma e rola os dados pela ficha. O mestre escolhe uma aventura pronta, abre a sala e organiza os grupos em tempo real.

## Por que escolhi esse tema

O Codex Arcana coloca os alunos no papel de uma equipe de software: entender o que o cliente precisa, negociar prioridades, encontrar requisitos ambíguos e validar soluções. O aplicativo reúne o que acontece em volta da mesa — fichas, salas, grupos e aventuras — numa interface direta, para que a aula comece rápido e o foco fique no jogo.

## Requisitos do TP2

| Técnica | Como foi aplicada | Código |
| --- | --- | --- |
| **Axios e JSON** | O app conversa com o servidor de aventuras: cadastro e login, criação e exclusão de salas, busca por GPS, entrada por código, lobby atualizado a cada 3 s, formação dos grupos e o personagem escolhido por cada jogador. | `src/services/api.ts`, `src/services/rooms.ts`, `server/server.mjs` |
| **AsyncStorage** | Aventuras cadastradas pelo mestre (com personagens e fotos), preferência de detalhes da ficha e contas locais. | `src/hooks/useAdventures.ts`, `src/hooks/useAttributePreference.ts`, `src/services/accounts.ts` |
| **SQLite** | Fichas dos personagens: criar, ler, atualizar (notas, marco de nível, retrato) e excluir, com SQL parametrizado. | `src/services/database.ts`, `src/state/characters.tsx` |
| **GPS** | A sala é criada com a localização do mestre como centro e raio de 100 m. O jogador só encontra ou entra na sala (inclusive pelo código) se o GPS confirmar que ele está dentro do raio, com precisão suficiente e leitura recente. | `src/services/location.ts`, `src/app/(private)/rooms.tsx`, `src/app/(private)/create-room.tsx` |

O app também usa **câmera e manipulação de imagens** (retrato da ficha, fotos dos personagens e ícone das aventuras, com redimensionamento e compressão JPEG) em `src/services/photos.ts` e `src/components/Portrait.tsx`.

## O que dá para fazer

**Jogador**
- Escolher entre 10 personagens prontos (5 classes) e consultar a ficha com atributos, estatísticas e caderno.
- Rolar d20 + modificador tocando em um atributo, ou dados avulsos.
- Escolher com qual personagem jogar e entrar na sala pelo GPS ou pelo código do mestre.
- Acompanhar o lobby e ver em qual grupo está.

**Mestre**
- Ler aventuras prontas de 50 minutos (objetivos, roteiro, personagens com segredos e testes sugeridos) ou cadastrar as próprias, com ícone e personagens com foto.
- Criar a sala escolhendo a aventura; a sala só fica aberta enquanto o mestre está no lobby.
- Mover alunos entre grupos, renomear grupos, ajustar vagas, reabrir ou excluir a sala.
- Consultar o guia do mestre com o roteiro de uma aula.

## Interface

Tema escuro e minimalista com pegada de tecnologia: rótulos em fonte mono, uma ação principal por tela, trilha de missão guiando o jogador e explicações recolhidas atrás do botão “?”.

## Como executar

Requer Node.js 22.13+ e Expo SDK 58.

```bash
npm install
npm run server:configure   # define o endereço do servidor no .env.local
npm run server             # servidor de aventuras (porta 3001)
npx expo start             # app (Expo Go ou development build)
```

Celular e computador precisam estar na mesma rede. Câmera e SQLite funcionam no Android/iOS; na prévia web (`npm run web`) as fichas usam AsyncStorage e a câmera fica desativada. Detalhes das salas em [docs/SALAS.md](docs/SALAS.md).

## Organização do projeto

```text
src/
  app/          # Rotas (Expo Router): login, áreas do jogador e do mestre
  screens/      # Telas maiores (início, ficha, classes, guia)
  components/   # Componentes de interface reutilizáveis
  data/         # Classes, atributos, personagens e aventuras
  services/     # API (Axios), salas, GPS, fotos, SQLite e contas
  state/        # Contextos de autenticação e fichas
  hooks/        # Preferências e aventuras (AsyncStorage)
server/         # Servidor de aventuras (Node + SQLite) e testes
tests/          # Testes de regras, contas, banco e aventuras
```

## Verificações

```bash
npm run typecheck
npm run lint
npm test             # regras, contas, banco e aventuras
npm run test:server  # salas, GPS, presença do mestre, exclusão e personagens
```

## Limites

Ficha inicial simplificada (modelos prontos, nível 1 e 2 por marco), adaptada para o recorte acadêmico. O aplicativo não substitui o Livro do Mestre.
