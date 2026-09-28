# Codex Arcana Mobile

**Trabalho Prático 1 · Desenvolvimento de Aplicações para Dispositivos Móveis**

![Livro luminoso do Codex Arcana em um fundo violeta e ciano](assets/images/codex-banner.png)

Um aplicativo para conhecer as classes do Codex Arcana, criar uma ficha de personagem e ter as informações por perto durante a sessão de RPG.

## Por que escolhi esse tema

Desenvolvi este aplicativo como trabalho da disciplina de **Desenvolvimento de Aplicações para Dispositivos Móveis**. A ideia foi colocar em prática os conteúdos estudados em aula e, ao mesmo tempo, criar algo que pudesse ajudar em outro projeto do qual participo: o **Codex Arcana**.

O Codex Arcana é um RPG de mesa voltado ao ensino de **Engenharia de Requisitos**. Nele, os jogadores assumem papéis de uma equipe de software e enfrentam situações como entender o que um cliente precisa, negociar prioridades, identificar requisitos ambíguos e validar soluções. O Mestre conduz essas situações, e a equipe precisa conversar, tomar decisões e trabalhar em conjunto.

Escolhi esse tema porque vi uma oportunidade de aproximar os dois projetos. Quem está começando no RPG precisa conhecer as classes, entender os atributos e preencher uma ficha. Minha proposta foi reunir esse primeiro contato em uma interface mais visual, com escolhas por etapas e explicações curtas, para a pessoa aprender aos poucos.

Para esta primeira entrega, mantive a implementação simples. O foco está na interface, na navegação e no uso dos componentes do React Native. O aplicativo funciona com dados locais e modelos prontos de personagem, deixando o montador completo para uma evolução futura.

## O que dá para fazer

- **Conhecer as cinco classes:** consultar o papel de cada uma, seus bônus, habilidades, proficiências e equipamentos.
- **Criar um personagem:** escolher a classe, informar o nome e revisar a ficha em três etapas.
- **Consultar a ficha:** visualizar os 12 atributos, modificadores e estatísticas calculadas.
- **Rolar dados:** tocar em um atributo para rolar d20 com modificador e proficiência opcional, ou usar d8, d10 e d20 avulsos.
- **Registrar um marco:** avançar do nível 1 para o 2 após uma conquista autorizada pelo Mestre.
- **Fazer anotações:** manter um pequeno caderno individual para cada personagem.
- **Aprender a jogar:** abrir os tópicos do guia conforme surgirem dúvidas sobre a ficha e os testes.

### Quem você pode ser?

| Classe | Papel na equipe |
| --- | --- |
| Analista de Requisitos | Investiga necessidades e organiza requisitos, diagramas e documentação. |
| Desenvolvedor de Software | Transforma os requisitos em funcionalidades do sistema. |
| Analista de Negócios | Entende o negócio e as necessidades das pessoas envolvidas. |
| UX/UI Designer | Trabalha a experiência do usuário, as interfaces e os protótipos. |
| Analista de Qualidade | Verifica, valida e planeja testes para encontrar problemas. |

Cada classe tem uma cor e uma insígnia. Os modelos começam no nível 1, com **36 pontos distribuídos**, além de **+2 em um atributo e +1 em outro**. As informações mais detalhadas ficam recolhidas e podem ser abertas com um toque, para não sobrecarregar a leitura.

## O que apliquei da disciplina

O projeto foi desenvolvido com **React Native, Expo e TypeScript**, utilizando **React Navigation** entre as telas.

| Conteúdo trabalhado | Aplicação no projeto |
| --- | --- |
| Componentes funcionais | Telas e componentes reutilizáveis, como botões e cartões de classe. |
| Props | Passagem de dados das fichas, classes e ações entre componentes. |
| State | Seleção de classe, etapas da criação, personagens, anotações, marcos e resultados dos dados. |
| `View`, `Text`, `Image` e `Pressable` | Organização das telas, textos, imagem local e controles de interação. |
| `StyleSheet` e Flexbox | Tema escuro, espaçamento, alinhamento e distribuição dos elementos. |
| `FlatList` e `SectionList` | Listas de personagens, classes, atributos e tópicos do guia. |
| React Navigation | Navegação pelas seis telas do aplicativo. |
| `ScrollView` no mobile | Leitura de conteúdos maiores. Na web, o componente de tela usa a rolagem do navegador. |

O trabalho também me permitiu aplicar validação de campos, separar os dados da interface e compartilhar o mesmo componente em diferentes telas.

## Telas do aplicativo

| Tela | Para que serve |
| --- | --- |
| Início | Acessar as fichas, criar um personagem e abrir o catálogo ou o guia. |
| Classes | Escolher entre os cinco papéis disponíveis. |
| Detalhes da classe | Entender a classe antes de usá-la. |
| Criar ficha | Escolher classe, preencher nome e conferir o personagem. |
| Minha ficha | Consultar atributos, rolar dados, registrar um marco e fazer anotações. |
| Guia do sistema | Entender a criação da ficha e os primeiros passos na mesa. |

## Como executar

É necessário ter **Node.js compatível com o Expo SDK 57**, npm e o **Expo Go compatível com esse SDK** no celular. O projeto utiliza Node 22.13 ou superior.

No terminal, entre na pasta que contém o `package.json`. Se estiver na pasta pai do projeto:

```powershell
cd meu-app
npm install
npx expo start
```

Com o computador e o celular na mesma rede, abra o projeto pelo QR code no Expo Go. Para executar a versão web, use `npm run web`. Para recarregar durante o desenvolvimento, pressione `r` no terminal do Expo.

> **Sobre os dados:** esta versão usa dados mockados e estado em memória. Não há API, banco de dados, login ou persistência. Ao recarregar ou reiniciar o aplicativo, as fichas criadas, anotações e marcos são apagados, e a ficha de exemplo volta ao estado inicial.

## Organização do projeto

```text
App.tsx                 # Navegação e estado dos personagens
src/
  components/           # Componentes reutilizáveis da interface
  data/                 # Classes, atributos, modelos e cálculos
  screens/              # Telas do aplicativo
  navigation.ts         # Tipos das rotas
  styles.ts             # Cores e estilos compartilhados
assets/                 # Imagens locais
tests/                  # Testes das regras e dos cálculos
docs/                   # Escopo e revisão da entrega
```

## Limites desta primeira versão

A proposta é apoiar a criação de uma **ficha inicial simplificada**. Ainda não há distribuição livre de pontos, gerenciamento de campanhas, arquétipos ou progressão acima do nível 2.

O avanço acontece por **marcos reconhecidos pelo Mestre**, sem contador de XP. O aplicativo registra a conquista e recalcula o Estresse máximo; a proficiência permanece +2 nos dois níveis. Refinamentos de habilidades são combinados na mesa e podem ser anotados no caderno.

As classes e alguns conteúdos foram adaptados para o recorte do trabalho. As habilidades aparecem como resumos de consulta, e o aplicativo não substitui o Livro do Mestre. O valor de Estresse exibido é o máximo do nível atual; perdas e recuperação podem ser registradas nas anotações.

<details>
<summary>Adaptações e cálculos usados na ficha</summary>

- Bônus: Requisitos COM +2/MOD +1; Desenvolvimento ANA +2/AUT +1; Negócios NEG +2/ANA +1; UX/UI EMP +2/MOD +1; Qualidade VAL +2/CRI +1.
- Cada modelo usa um atributo base 14, um 13, seis 12 e quatro 8, totalizando 36 pontos de custo. Os bônus de classe não consomem pontos.
- Modificador: `(total do atributo − 10) / 2`, arredondado para baixo.
- Estresse máximo: base da classe + (modificador de RES × nível).
- Iniciativa: mod. COM + mod. LID; Confiança: mod. EMP + mod. ETI; Qualidade: mod. MOD + mod. ANA.
- A base de Estresse é 8 nas cinco classes. Para Desenvolvedor, esse valor e parte dos equipamentos/proficiências são adaptações locais do protótipo. UX/UI também inclui adaptações do papel de pesquisa com usuários para interfaces e protótipos.

Essas escolhas organizam a versão acadêmica e não pretendem definir as regras finais do Codex Arcana.

</details>

## Verificações

Foram realizadas verificações de TypeScript, lint, testes dos modelos e cálculos, Expo Doctor e exportação dos bundles para Android, iOS e web. Os fluxos também foram conferidos no navegador em telas estreitas.

```bash
npm run typecheck
npm run lint
npm test
npx expo-doctor
npx expo export --platform all
```

A validação completa no aparelho com Expo Go ainda precisa incluir teclado, botão Voltar do Android e fonte ampliada. A exportação dos bundles não substitui esse teste.

## Próximos passos

Depois desta entrega, quero aproveitar a base do aplicativo para desenvolver um montador de fichas mais completo para o Codex Arcana. A ideia é trabalhar essa evolução separadamente, com distribuição de atributos, arquétipos e outras opções do sistema, preservando a simplicidade do primeiro trabalho.

Para consultar as decisões técnicas e o acompanhamento da entrega:

- [Escopo do projeto](docs/ESCOPO-CODEX-ARCANA.md)
- [Revisão dos requisitos e roteiro de testes](docs/REVISAO-TP1.md)
