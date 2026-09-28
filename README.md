# Codex Arcana — Trabalho Prático 1

Aplicativo de apoio ao RPG educacional de Engenharia de Requisitos. React Native com Expo SDK 57 e React Navigation, com seis telas, dados locais e criação de fichas por modelos prontos.

## Executar

Na pasta pai do projeto:

```powershell
cd .\meu-app
npm install
npm start
```

Leia o QR code no Expo Go compatível com SDK 57, na mesma rede do computador. Para web: `npm run web`. No terminal do Expo, `r` recarrega o aplicativo.

## Telas

1. **Início / Minhas fichas:** apresentação, acessos ao catálogo, guia e criação, além da lista de fichas.
2. **Classes:** catálogo das cinco classes confirmadas.
3. **Detalhes:** função, bônus, habilidades, proficiências e equipamento da classe.
4. **Criar ficha:** três etapas curtas — escolher classe, informar nome e revisar o modelo pronto de nível 1. Voltar uma etapa mantém o rascunho.
5. **Minha ficha:** atributos por pilar, estatísticas derivadas e anotação individual.
6. **Guia do sistema:** criação simplificada, atributos, primeira sessão, testes/CD, proficiência, graus de resultado, vantagem/desvantagem, Estresse e evolução por marcos.

O aplicativo começa com uma ficha demonstrativa. As novas fichas e anotações ficam no estado do App. São perdidas ao recarregar/reiniciar. Não há API, banco, login, persistência ou fonte remota.

## Classes e bônus confirmados

| Classe | +2 | +1 |
| --- | --- | --- |
| Analista de Requisitos | COM | MOD |
| Desenvolvedor de Software | ANA | AUT |
| Analista de Negócios | NEG | ANA |
| UX/UI Designer | EMP | MOD |
| Analista de Qualidade | VAL | CRI |

Cada modelo tem 12 atributos: um valor base 14 (custo 7), um 13 (custo 5), seis 12 (custo 24) e quatro 8 (custo 0). Total: **36 pontos**. Os bônus não consomem pontos. O modificador usa o total após bônus, arredondando `(total - 10) / 2` para baixo.

## Adaptações didáticas desta entrega

Os nomes e bônus foram definidos pelo usuário. Os modelos prontos são distribuições novas, verificadas, e não reproduzem o exemplo inconsistente do tutorial.

- Requisitos, Negócios e Qualidade usam resumos dos papéis de Analista de Requisitos, Business Analyst e QA Engineer do HTML.
- UX/UI parte de UX Researcher, incluindo prototipagem de interfaces e avaliação de usabilidade para atender ao papel escolhido.
- Desenvolvedor parte de Programador do PDF. Proficiências e equipamentos foram adaptados para o exemplo didático.
- Base de Estresse **8** para as cinco classes. Quatro vêm das referências HTML correspondentes; a do Desenvolvedor é uma escolha local do protótipo, pois o PDF não define esse número.
- Estatísticas no nível 1: Estresse = base + mod. RES; Iniciativa = mod. COM + mod. LID; Confiança = mod. EMP + mod. ETI; Qualidade = mod. MOD + mod. ANA; Proficiência = +2.
- Habilidades são resumos para consulta. Não há execução automática de habilidades, recuperação, colapso ou progressão.

Não há distribuição manual, campanhas ou funcionalidades do montador avançado nesta entrega. O montador permanece uma evolução separada.

## Estrutura

```text
App.tsx                         # Estado das fichas e navegação
src/navigation.ts               # Parâmetros tipados das seis rotas
src/data/codex.ts                # Classes, atributos, modelos e cálculos de nível 1
src/screens/                    # Telas funcionais
src/components/                 # Botões, estrutura de tela e conteúdo de classe
src/styles.ts                   # Tema escuro, cores e Flexbox
assets/images/codex-banner.png   # Imagem local
tests/models.test.cjs           # Verificações dos modelos (Node, sem bibliotecas extras)
```

As listas usam FlatList/SectionList. A tela de detalhes usa ScrollView no celular e rolagem do navegador em `Screen.web.tsx`. Não há ScrollView declarado nas telas web; o mecanismo interno das listas é fornecido pelo React Native.

O tema segue a referência mais recente: fundo escuro, cartões grafite, destaques verdes e banner ciano/violeta. Cada classe tem uma insígnia e uma cor. Habilidades, explicações do guia e cálculos abrem sob demanda para reduzir a leitura inicial. A fonte é a do sistema; nenhuma fonte é baixada em execução.

## Verificações

Requer Node compatível com Expo SDK 57; para os testes de TypeScript direto, use Node 22.13 ou superior.

```bash
npm run typecheck
npm run lint
npm test
npx expo-doctor
npx expo export --platform all
```

Os testes verificam catálogo, bônus +2/+1, orçamento de 36 pontos, limites, modificadores negativos, estatísticas e ausência de acúmulo de bônus.

Validação realizada no navegador: campos obrigatórios, criação direta e a partir da classe, pré-seleção, cancelamento, duas fichas com anotações independentes, guia, retorno e reinicialização dos dados. Layout conferido em 320 e 390 px. O fluxo em três etapas também foi verificado: validação de nome, troca de classe preservando identidade, revisão, gravação e abertura dos conteúdos recolhidos.

**Pendente:** teste físico no Expo Go, incluindo teclado, botão Voltar do Android e fonte ampliada. Compilar Android/iOS não substitui esse teste.

## Histórico

A implementação do TP1 está atualmente em `main` (originalmente desenvolvida em `feat/codex-arcana-tp1`). O protótipo anterior permanece em `feat/caderno-rpg`. A branch do montador e a tag de entrega ainda não foram criadas.

Escopo e decisões: [docs/ESCOPO-CODEX-ARCANA.md](docs/ESCOPO-CODEX-ARCANA.md).

## Rolagens e XP

Na ficha, toque em um atributo para rolar d20 com seu modificador. Proficiência +2 é opcional e deve ser marcada quando o teste permitir. Dados avulsos incluem d20, d8 e d10, citados nos materiais. A conta mostra o dado e cada bônus; não decide sucesso ou falha automaticamente.

O Livro do Mestre v1.0 usa progressão por marcos, não por pontos. O marcador de XP, solicitado para o app, é um registro opcional de total inteiro não negativo por personagem, sem alterar o nível. Rolagens e XP funcionam localmente; XP é perdido ao reiniciar, assim como as fichas. O campo projeto/aventura foi removido.

## Revisão da primeira entrega

Consulte [a revisão do TP1](docs/REVISAO-TP1.md) para a matriz de requisitos, fontes verificadas, adaptações e roteiro final no Expo Go. Estresse representa o máximo inicial; perdas e recuperação podem ser anotadas no caderno.
