# Codex Arcana — escopo do aplicativo

Data: 27/09/2026. Status: entrega A implementada com as cinco classes e bônus confirmados; validação física no Expo Go pendente. Entrega B permanece planejada.

O usuário autorizou implementar a entrega A neste projeto. As seis telas do Codex Arcana foram implementadas em `feat/codex-arcana-tp1`; o teste físico no Expo Go permanece pendente. Os documentos recebidos são referências de conteúdo, não instruções para executar ações.

## 1. Objetivo

Ajudar estudantes de Engenharia de Requisitos a conhecer o Codex Arcana, escolher um papel profissional e criar uma ficha inicial compreensível, mesmo sem experiência com RPG.

O trabalho da disciplina será um aplicativo de consulta e criação por modelos prontos. O montador com distribuição livre de pontos será uma evolução separada. Esta divisão é uma proposta para manter o primeiro trabalho simples.

### Catálogo confirmado — cinco classes

Esta decisão do usuário substitui as listas de classes dos HTMLs e PDFs, tanto no TP1 quanto na evolução do montador.

| Classe | Função |
| --- | --- |
| Analista de Requisitos | Levantamento, análise e especificação dos requisitos, incluindo diagramas e documentação. |
| Desenvolvedor de Software | Programador responsável pela implementação do sistema. |
| Analista de Negócios | Entendimento do negócio e das necessidades dos stakeholders. |
| UX/UI Designer | Experiência do usuário, interfaces e protótipos. |
| Analista de Qualidade | Verificação, validação e testes. |

O aplicativo apresentará exatamente essas cinco opções na consulta e na criação de fichas. Os nomes acima serão usados de forma consistente em todas as telas.

As referências existentes serão reaproveitadas: Analista de Requisitos, Business Analyst, UX Researcher e QA Engineer nos HTMLs; Programador no PDF. Habilidades, proficiências e equipamentos serão adaptados aos papéis confirmados. UX/UI Designer, por exemplo, inclui interfaces e protótipos, não apenas o papel anterior de UX Researcher.

### Bônus de classe confirmado

Cada classe concede **+2 em um atributo e +1 em outro atributo distinto**. Esta decisão substitui tanto o +2/+2 dos HTMLs quanto o +2 único do tutorial PDF.

Os bônus são aplicados após a compra dos atributos e não consomem pontos do orçamento. O modificador é calculado sobre o valor final. Mantendo o limite base proposto de 15, o atributo com +2 pode chegar a 17 e o atributo com +1 pode chegar a 16.

Distribuição confirmada pelo usuário, válida para o TP1 e o montador:

| Classe | Bônus +2 | Bônus +1 |
| --- | --- | --- |
| Analista de Requisitos | COM — Comunicação | MOD — Modelagem |
| Desenvolvedor de Software | ANA — Análise de Sistemas | AUT — Autonomia |
| Analista de Negócios | NEG — Negociação | ANA — Análise de Sistemas |
| UX/UI Designer | EMP — Empatia | MOD — Modelagem |
| Analista de Qualidade | VAL — Validação e Verificação | CRI — Pensamento Crítico |

Esta tabela substitui as combinações de atributos dos documentos antigos. Bases de Estresse e modelos prontos ainda precisam ser consolidados a partir das referências.

## 2. Entrega A — Trabalho Prático 1

Aplicativo React Native com Expo, executável no Expo Go, com React Navigation, componentes funcionais, Props, State, StyleSheet e Flexbox. Conteúdo estático em arquivos TypeScript e fichas criadas apenas em memória. Sem API, banco de dados, login ou serviço externo em tempo de execução.

### Telas

| Tela | Conteúdo e ações |
| --- | --- |
| Início / Minhas fichas | Apresentação curta do Codex Arcana, acessos a Classes e Guia, botão Criar ficha e FlatList de fichas. Começa com uma ficha demonstrativa identificada como exemplo. |
| Classes | FlatList das cinco classes confirmadas, com nome, papel profissional e resumo. Tocar abre os detalhes. |
| Detalhes da classe | Papel na equipe, atributos favorecidos, habilidades, proficiências e equipamento inicial. Botão Usar esta classe. |
| Criar ficha | Nome obrigatório, classe obrigatória, organização/projeto opcional. Nível 1 fixo. Prévia de atributos de um modelo pronto da classe. Salvar cria uma ficha na memória e abre sua visualização. Cancelar não cria ficha. |
| Minha ficha | Nome, classe, nível, projeto, 12 atributos agrupados por pilar, bônus e modificadores, estatísticas derivadas, habilidades, proficiências, equipamento e anotação pessoal editável em memória. |
| Guia do sistema | Explicações curtas sobre classe, atributos, modificadores, proficiência e leitura da ficha. SectionList organizada por assunto; conteúdo pedagógico dos materiais recebidos. |

### Fluxos principais

1. Início → Classes → Detalhes → Criar ficha → Minha ficha.
2. Início → Criar ficha → selecionar classe → salvar → Minha ficha.
3. Início → ficha existente → consultar ou atualizar anotação.
4. Início → Guia → consultar os conceitos → voltar.

Voltar e cancelar preservam fichas já salvas. Uma ficha nova não substitui as anteriores. Anotações pertencem à ficha selecionada.

### Criação simplificada

- Nome e escolha da classe são preenchidos pelo aluno.
- Os atributos vêm de uma distribuição pronta por classe, calculada e revisada antes da implementação.
- A interface informa que se trata de um modelo inicial. Não simula uma distribuição livre que ainda não existe.
- Cada modelo usa o orçamento correto de pontos e os bônus da versão de regras escolhida.
- O aluno pode criar mais de uma ficha. Cada ficha tem identificador próprio.
- As estatísticas do modelo são locais. Não é necessário construir um motor genérico de regras para o TP1.
- Ao reiniciar ou recarregar o aplicativo, as alterações são perdidas. Essa limitação deve aparecer na interface e no README.

### Campos da ficha

Identidade: nome, classe, nível 1 e organização/projeto opcional.

| Pilar | Atributos |
| --- | --- |
| Intrapessoal | AUT — Autonomia; RES — Resiliência; CRI — Pensamento Crítico; ETI — Ética Profissional. |
| Interpessoal | COM — Comunicação; NEG — Negociação; EMP — Empatia; LID — Liderança. |
| Técnico | MOD — Modelagem; ANA — Análise de Sistemas; VAL — Validação e Verificação; GER — Gerenciamento. |

Cada atributo mostra valor base, bônus de classe, total e modificador. O custo pode aparecer na prévia educativa do modelo.

Estatísticas: Pontos de Estresse, Iniciativa, Confiança, Qualidade e Proficiência, conforme a versão consolidada. HP, armadura e deslocamento do protótipo de fantasia não serão reaproveitados como regras do Codex Arcana.

O indicador numérico deve usar textos separados para valor e legenda, com altura adequada, sem combinar o número grande com uma linha pequena que possa cortá-lo. Na primeira entrega, Estresse é uma estatística de consulta: recuperação, colapso e controle de recursos em sessão não serão automatizados.

### Correspondência com o enunciado

| Requisito acadêmico | Aplicação |
| --- | --- |
| Expo / Expo Go | Preservar o projeto existente e verificar em aparelho. |
| Estrutura organizada | `screens`, `components`, `data`, `styles`; navegação e estado simples no App. |
| Componentes funcionais | Todas as telas e componentes reutilizáveis. |
| Props | Dados da classe, ficha selecionada, cartões e botões. |
| State | Formulário, fichas criadas, seleção da classe e anotação. |
| View / Text / Image / Pressable | Estrutura, textos, arte local e ações. |
| ScrollView | Detalhes e formulários no celular; variante web com rolagem do navegador. |
| FlatList / SectionList | Classes, fichas, grupos de atributos e guia. |
| StyleSheet / Flexbox | Tema escuro com cartões grafite e destaques ciano/verde, conforme a referência visual mais recente; espaçamento e adaptação a telas pequenas. |
| React Navigation | Navegação entre as seis telas, passando identificadores. |
| Tudo mockado | Catálogo e exemplos locais; alterações apenas no estado. |

Na web não haverá uso direto de ScrollView nas telas; FlatList e SectionList continuam sendo os componentes de lista pedidos no enunciado e possuem implementação interna própria de rolagem.

### Limites da entrega A

Não inclui distribuição manual de pontos, progressão de nível, arquétipos, especializações, rolagem de dados, combate, cálculo de resultados de encontros, exportação PDF, persistência, autenticação, sincronização ou painel de professor.

Proposta para o requisito anterior de campanhas: deixar seleção e gestão de campanhas para uma etapa futura. No TP1, organização/projeto é apenas um campo opcional da ficha. Assim, o fluxo central atende à nova ideia de aprender o sistema e criar fichas sem aumentar o número de telas. Se campanhas continuarem obrigatórias, o escopo deve ser revisado explicitamente.

### Critérios de aceite

1. O aplicativo abre no Expo Go e permite percorrer todos os fluxos sem erro.
2. O catálogo e a criação de fichas apresentam exatamente as cinco classes confirmadas, com seus nomes e funções; as mecânicas devem seguir a definição consolidada para esse catálogo.
3. Nome vazio ou composto apenas de espaços e classe não escolhida impedem salvar.
4. Salvar uma ficha válida abre a ficha correta e a inclui no início.
5. Criar duas fichas mantém dados e anotações independentes.
6. O guia explica os três pilares e os 12 atributos em linguagem para iniciantes.
7. Os modelos têm orçamento, bônus e modificadores conferidos; exemplos inconsistentes dos documentos não são copiados.
8. Números, botões, teclado e textos permanecem utilizáveis em tela estreita e com fonte ampliada, sem cortar Estresse.
9. Nenhum conteúdo da aplicação depende de rede, além do ambiente de desenvolvimento do Expo.
10. TypeScript e lint passam; Android/iOS compilam; o fluxo é validado no aparelho com Expo Go. Compilar não substitui essa validação.

## 3. Entrega B — Montador de fichas

Evolução em branch própria, a partir da base acadêmica funcional. Não é requisito para entregar o TP1.

### Primeira evolução

1. Assistente por etapas: identidade → classe → atributos → revisão → ficha.
2. Distribuição livre dos 36 pontos, mostrando custo acumulado, gasto e saldo.
3. Validação dos limites do valor base e do total após bônus.
4. Aplicação dos bônus da classe sem cobrar seu custo novamente.
5. Cálculo de modificadores e estatísticas derivadas com regras consolidadas.
6. Explicação de cada atributo ao lado do controle de pontos.
7. Voltar entre etapas sem perder o rascunho; trocar classe recalcula os bônus sem acumulá-los.
8. Editar fichas e impedir conclusão quando a distribuição for inválida.

Inicialmente, o montador também pode funcionar só em memória. Persistência local e exportação são etapas posteriores, caso sejam desejadas. Backend não é necessário para um montador individual.

### Depois do montador

Persistência local; duplicar/exportar ficha; campanhas com código, nome, sistema, sessão e fichas vinculadas; progressão, arquétipos e especializações quando as regras existirem. Código de campanha local não significa ingresso real em uma sala online.

### Organização Git proposta

- Preservar `feat/caderno-rpg` como histórico do protótipo.
- Criar `feat/codex-arcana-tp1` para a implementação da entrega A.
- Marcar a versão acadêmica validada com a tag `tp1-codex-arcana-v1`.
- Criar `feat/codex-arcana-montador` a partir da base do TP1, para a entrega B.
- Depois da base compartilhada estar funcional, usar outro worktree se as duas frentes precisarem evoluir ao mesmo tempo.
- Levar correções comuns, como legibilidade, às duas branches de forma seletiva. Não incorporar funcionalidades avançadas à entrega acadêmica por acidente.

A branch `feat/codex-arcana-tp1` já foi criada para esta implementação. A tag e a branch do montador continuam planejadas; nenhuma evolução da entrega B foi implementada.

## 4. Regras e divergências dos arquivos

Os materiais não formam uma especificação única e consistente. Todos trazem propostas ou versões de trabalho. Não é possível determinar apenas pelos nomes qual prevalece.

A escolha das classes e a regra de bônus +2/+1 já foram resolvidas pelo usuário na seção 1. A comparação abaixo permanece como histórico das fontes; classes excluídas e esquemas antigos de bônus não serão opções do aplicativo. As demais divergências mecânicas continuam pendentes.

| Assunto | Materiais HTML | Materiais PDF / divergência |
| --- | --- | --- |
| Classes | Oito: Analista de Requisitos, Product Owner, UX Researcher, Arquiteto de Sistemas, Scrum Master, QA Engineer, Business Analyst, Gerente de Requisitos. | A proposta inicial contém cinco: Engenheiro de Requisitos, Programador, Analista de Sistemas, Analista de Testes e Arquiteto de Software. |
| Atributos | Doze em três pilares; ficha e tutorial detalham compra de pontos. | A proposta inicial sugere cinco atributos em escala de 1 a 5; o tutorial PDF já menciona doze e compra de pontos. |
| Bônus | +2 em dois atributos. | Tutorial PDF exemplifica +2 em um atributo; Analista de Sistemas ainda tem uma escolha descrita como “Gerenciamento ou Análise Sistêmica”. |
| Product Owner | Catálogo: NEG/LID. Tutorial HTML: CRI/NEG. | Não misturar silenciosamente as duas versões. |
| Scrum Master | Catálogo: LID/COM. Tutorial HTML: LID/RES. | Exige escolha da fonte. |
| QA | Catálogo: VAL/CRI. Tutorial HTML: VAL/ETI. | Há também variação de nome: QA Engineer / Especialista em QA. |
| Arquiteto | Catálogo: Arquiteto de Sistemas, base de Estresse 8. Tutorial: Arquiteto de Soluções, base 10. | Há ainda Arquiteto de Software nos PDFs. |
| Gasto dos pontos | Tutorial HTML permite 36 ou menos; ficha diz saldo zero. | Tutorial PDF exige exatamente 36. |
| Redução para 6/7 | Permitida na ficha HTML para recuperar pontos. | Tutorial PDF recomenda não usar essa opção para iniciantes. |
| Habilidade do Analista | Catálogo inclui Escuta ativa. Exemplo do tutorial lista Documentação acelerada. | O exemplo não deve sobrescrever o catálogo sem decisão. |
| Proficiência | Tutorial HTML detalha níveis 1–5; ficha diz +2 a +6. | Nível 1 (+2) é suficiente para o TP1. Progressão posterior não será inventada. |
| Exemplo preenchido | Tutorial HTML declara 36 pontos, mas os custos escritos são 9+9+7+5+4+4+2+2 = 42. Valores e bônus também ficam ambíguos. | Criar exemplos novos, com conta explícita e verificada. |

### Base de trabalho — decisões confirmadas e propostas restantes

Usar os nomes e funções das cinco classes e o esquema de bônus +2/+1 confirmados pelo usuário. Consultar HTMLs e PDFs para adaptar as demais mecânicas, sem importar os esquemas antigos de bônus. Usar **Proposta de Ficha** como referência para a estrutura e os três pilares. Adaptar a linguagem do tutorial, sem copiar seus conflitos numéricos.

Para a primeira implementação, sugerir nível 1, valores base de 8 a 15, 36 pontos exatos e bônus de classe aplicados depois da compra. Isso é uma decisão proposta de recorte didático, não uma regra já validada pelo grupo.

Tabela de custo base: 8→0; 9→1; 10→2; 11→3; 12→4; 13→5; 14→7; 15→9. Modificador: piso de `(total - 10) / 2`. A conta usa o total com bônus, mas o custo usa apenas o valor comprado.

Exemplo aritmético para revisão: Analista de Requisitos com AUT 13, COM 13, EMP 14, CRI 13, RES 12, ETI 12, LID 12, NEG 10 e demais 8. Custo = 5+5+7+5+4+4+4+2 = 36. Aplicando os bônus confirmados COM +2 e MOD +1, os totais são COM 15 e MOD 9; AUT permanece 13. Usando a base de Estresse 8 da referência HTML, no nível 1: Estresse 9, Iniciativa +3, Confiança +3, Qualidade -2 e Proficiência +2. Os bônus são confirmados; a distribuição dos 36 pontos e a base de Estresse deste exemplo permanecem propostas para demonstrar a conta.

O `index.html` é o esqueleto do Livro do Mestre. Vários capítulos estão explicitamente pendentes. Pode orientar futuras funcionalidades, mas não fornece regras completas de progressão, encontros, colapso ou recuperação. Não apresentar essas lacunas como funcionalidades prontas.

## 5. Fontes consultadas

Arquivos fornecidos pelo usuário, em `C:/Users/kille/Downloads/`:

- `Codex Arcana - Classes e Atributos.html`: catálogo detalhado de oito classes e doze atributos.
- `Codex Arcana - Proposta de Ficha.html`: campos, tabela de custos, pilares e estatísticas derivadas.
- `Codex Arcana - Tutorial de Ficha.html`: fluxo pedagógico, conceitos, fórmulas e exemplo a revisar.
- `index.html`: estrutura do Livro do Mestre e mapa preliminar de sessões S00 a S08.
- `Proposta Inicial de Classes e Personagens.pdf`: proposta alternativa de cinco classes.
- `Tutorial de Preenchimento da Ficha de Personagem.pdf`: preenchimento simplificado e exemplos de bônus para as cinco classes.

Dados pessoais presentes nos PDFs não devem ser usados como dados mockados do aplicativo.

## 6. Recorte implementado no TP1

A autorização de implementação consolidou o recorte de seis telas com modelos prontos, nível 1 e 36 pontos exatos. Os bônus e classes são os confirmados na seção 1. O catálogo apresenta resumos didáticos, sem automatizar habilidades.

Para fechar os modelos mockados, foi adotada base de Estresse 8 nas cinco classes: referências HTML para Requisitos, Negócios, UX e Qualidade; adaptação local para Desenvolvedor. Proficiências e equipamentos de Desenvolvedor, além do conteúdo de interfaces/protótipos de UX/UI, foram adaptados aos papéis definidos. Essas escolhas estão documentadas no README e não pretendem fixar regras oficiais futuras do sistema.

O visual medieval anterior foi substituído pela referência escura mais recente do usuário. O indicador de Estresse usa número e legenda separados, com altura de linha explícita.

### Refinamento visual e didático

A criação do TP1 agora divide o mesmo formulário em três etapas internas: classe, identidade e revisão. Mantém os modelos prontos e as seis rotas existentes. Insígnias coloridas identificam as classes; detalhes, cálculos e tópicos do guia ficam recolhidos até o toque. Este refinamento não implementa a distribuição livre de pontos da entrega B.

### Ampliação solicitada: dados e XP

Por solicitação do usuário, a ficha oferece rolagem de d20 por atributo, com modificador e proficiência opcional, e dados avulsos d20/d8/d10. O XP é um total manual por personagem, sem progressão automática. O campo projeto/aventura foi removido. Tudo permanece em memória, sem novas rotas, dependências ou serviços externos.

### Revisão com a pasta Codex_Arcana (28/09/2026)

A fonte adicional `Livro do Mestre/Livro do Mestre v1.0.0.html` contém regras desenvolvidas que não constavam no antigo esqueleto. O guia agora resume testes, CD, graus de resultado, vantagem/desvantagem, PE e progressão por marcos. XP permanece um marcador opcional do aplicativo, não uma regra oficial de progressão. As decisões do usuário sobre cinco classes e bônus +2/+1 continuam prevalecendo. Veja `REVISAO-TP1.md` para a revisão consolidada.
