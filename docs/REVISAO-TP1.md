# Revisão da primeira entrega

Data: 28/09/2026.

O projeto atende à estrutura e ao recorte funcional do TP1. A revisão automatizada e os fluxos no navegador passaram. A aprovação integral em Expo Go ainda depende do roteiro no aparelho abaixo; a imagem enviada pelo usuário comprova a tela inicial aberta, não todos os fluxos.

## Requisitos da disciplina

| Requisito | Evidência | Resultado |
| --- | --- | --- |
| React Native com Expo | `package.json`, `index.ts`, `app.json` | Atendido; SDK 57 |
| Expo Go | Dependências compatíveis, Expo Doctor 21/21, exportação Android/iOS | Compatibilidade verificada; teste completo no aparelho pendente |
| Estrutura organizada | `src/screens`, `src/components`, `src/data`, navegação tipada | Atendido |
| Componentes funcionais | Telas e componentes escritos como funções | Atendido |
| Props e State | Fichas em `App.tsx`; seleção, formulário, dados, notas e XP por estado | Atendido |
| View, Text, Image e Pressable | Telas, banner local e controles | Atendido |
| ScrollView no mobile | `Screen.tsx` | Atendido |
| Sem ScrollView explícito na web | `Screen.web.tsx` usa rolagem do navegador | Atendido; FlatList/SectionList usam internamente os mecanismos do React Native |
| StyleSheet e Flexbox | `src/styles.ts` e estilos das telas | Atendido |
| FlatList/SectionList para dados | Classes, personagens, atributos e guia | Atendido |
| React Navigation | Seis rotas em `App.tsx` e `src/navigation.ts` | Atendido por solicitação expressa do usuário, que prevalece sobre o template Router |
| Interface móvel funcional | Navegação e conteúdo conferidos em 320 e 390 px | Atendido no navegador; fonte ampliada e teclado nativo pendentes |
| Sem API ou banco | Dados TypeScript locais, imagem local, estado em memória | Atendido |

## A pessoa consegue montar a ficha?

Sim, dentro da criação por modelos prontos acordada para o TP1: escolhe uma das cinco classes, informa o nome e revisa o personagem. A ficha inclui nível 1, doze atributos em três pilares, bônus +2/+1, modificadores, Estresse máximo, Iniciativa, Confiança, Qualidade, proficiência, habilidades resumidas, equipamentos, notas e XP opcional.

Os cinco modelos gastam exatamente 36 pontos antes dos bônus. O cálculo usa o valor final para o modificador e o valor base para o custo. Valores negativos são arredondados para baixo. Classes, bônus e cálculos foram verificados nos testes.

Não é um montador livre nem uma reprodução integral do sistema. Distribuição manual, arquétipos, especializações, progressão e campanhas seguem fora do TP1. Projeto/aventura foi removido por solicitação. Essas limitações não impedem demonstrar os conceitos cobrados pela disciplina.

## A pessoa entende como começar a jogar?

O guia explica o papel do jogador e do Mestre, quando pedir um teste, d20 + modificador + proficiência aplicável, comparação com CD, graus de resultado, vantagem/desvantagem, Estresse e evolução. Mantém explicações recolhidas para evitar uma tela longa de texto aberto.

Correções realizadas nesta revisão:

- Acrescentadas orientações de primeira sessão, teste e leitura do resultado.
- Acrescentada explicação das simplificações do app, para não apresentar adaptações como regras oficiais.
- Identificado o valor de Estresse como máximo inicial; o caderno permite registrar alterações durante a sessão.
- Esclarecido que o livro usa progressão por marcos; XP é apenas o marcador opcional solicitado para o app.
- Preservado o nome solicitado: `Davi / ficha de exemplo`.

O Mestre ainda precisa do material completo para aplicar efeitos de habilidades, encontros, recuperação e consequências. O app fornece uma introdução e uma ficha de consulta, não substitui o livro. Vantagem/desvantagem pode ser resolvida manualmente com duas rolagens avulsas; não foi criado um novo motor de regras.

## Fontes e decisões

Pasta encontrada: `C:/Users/kille/Desktop/Codex_Arcana`.

- `Livro do Mestre/Livro do Mestre v1.0.0.html`, capítulos 1, 3, 4 e 5: ciclo de jogo, testes, resultados, PE, derivados e progressão.
- `Classes/Codex Arcana - Classes e Atributos.html`: atributos, papéis, habilidades e dados d8/d10.
- `Ficha/Codex Arcana - Proposta de Ficha.html`: campos, custos e fórmulas.
- `Preenchimento da Ficha/Codex Arcana - Tutorial de Ficha.html`: orientação inicial e campos dispensáveis na primeira sessão.
- Proposta de classes e tutorial em PDF já usados na implementação: origem do papel de Programador/Desenvolvedor e histórico das divergências.

As fontes contêm versões diferentes. As decisões explícitas do usuário prevalecem: cinco classes escolhidas, bônus +2 e +1, modelos prontos e nível 1. A base de Estresse 8 do Desenvolvedor e parte dos equipamentos/proficiências são adaptações do protótipo, documentadas no README. Não se deve tratá-las como consolidação definitiva das regras do grupo.

O Livro v1.0 também contém um exemplo inconsistente: total 23 contra CD 15 é chamado de triunfo por margem de +10, embora a diferença seja 8. O guia usa a tabela de condições e um exemplo aritmético válido (11 + 3 + 2 = 16 contra CD 15), sem copiar essa inconsistência.

## Simplicidade

Seis rotas, três etapas internas de formulário, dois controles locais adicionais (rolagem e XP). Sem servidor, autenticação, biblioteca de formulários, gerenciador global de estado, animações complexas ou banco. Cálculos são funções pequenas; conteúdo é estático. O tamanho e os conceitos são adequados a um TP1 com o escopo aprovado.

Itens antigos sem uso no fluxo atual: `scripts/reset-project.js` e imagens remanescentes do template/protótipo. Não são importados pelo app nem impedem a entrega; não executar o reset, que recria o template inicial. Não foram removidos nesta revisão.

## Verificação

- TypeScript e lint: sem erros.
- Testes: 9/9, incluindo cinco modelos, orçamento, bônus, modificadores e extremos dos dados.
- Expo Doctor: 21/21 verificações aprovadas.
- Exportação de bundles Android, iOS e web: concluída. Não equivale a build nativo nem teste no dispositivo.
- Navegador: classe obrigatória, cinco opções, rejeição de nome em branco, retorno interno preservando nome, criação, notas e XP independentes, retorno à ficha, rolagem por atributo, proficiência opcional, d8/d10/d20 e reinicialização dos dados.
- Novas explicações do guia abertas e verificadas; rolagem sem transbordamento horizontal em 320 px. Nenhum erro JavaScript nos fluxos monitorados.

## Roteiro final no Expo Go

1. Abrir o QR code executando `npx expo start` dentro de `meu-app`.
2. Criar uma ficha, usar o teclado e voltar pelas etapas; salvar e retornar ao início.
3. Abrir atributos/dados, rolar e fechar pelo botão do app e pelo Voltar do Android.
4. Alterar XP e notas de duas fichas; conferir independência ao reabri-las.
5. Aumentar a fonte do aparelho e conferir botões, atributos e Estresse sem cortes.
6. Abrir os tópicos do guia. Reiniciar e confirmar o retorno apenas à ficha de exemplo, conforme o aviso do app.

Após esse roteiro, o responsável pela entrega pode confirmar o requisito de execução integral no Expo Go.
