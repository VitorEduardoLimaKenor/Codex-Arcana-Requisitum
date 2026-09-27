# Caderno de aventuras

Trabalho Prático 1 — Interface Mobile. Aplicação simples de RPG em React Native com Expo e React Navigation.

## Executar no Expo Go

```bash
cd meu-app
npm install
npm start
```

Abra o Expo Go compatível com o SDK 57 e leia o QR code. Computador e celular devem estar na mesma rede. Também é possível executar a versão web com `npm run web`.

## Telas e funcionalidades

- **Início:** campanha fictícia, resumo da personagem e acesso à ficha e ao diário.
- **Minha ficha:** personagem pronta, atributos, equipamento, história e botões para alterar os pontos de vida entre 0 e 28.
- **Diário:** listagem de anotações com FlatList e filtro de favoritas.
- **Nova anotação:** formulário com validação de campos obrigatórios.

Todos os dados são fictícios e locais. Não há chamadas a API, autenticação ou banco de dados. Vida, anotações e favoritas ficam no estado do componente App e são reiniciadas ao recarregar o aplicativo. A ficha inicial pode ser personalizada em `src/data/mock.ts`.

## Estrutura

```text
App.tsx                    # Estado compartilhado e React Navigation
index.ts                   # Registro do aplicativo no Expo
src/
  components/              # Botão e estrutura reutilizável das telas
  data/mock.ts             # Personagem e anotações fictícias
  screens/                 # Telas funcionais
  styles.ts                # Cores e estilos compartilhados
assets/images/camp.png     # Ilustração local
```

O projeto utiliza componentes funcionais, Props, useState, View, Text, Image, Pressable, TextInput, StyleSheet e Flexbox. No celular, Screen utiliza ScrollView. Na web, Screen.web.tsx utiliza rolagem do navegador, sem declarar ScrollView. As listas utilizam FlatList, cujo mecanismo de rolagem é interno ao React Native.

A configuração original recomendava Expo Router. Foi substituído por React Navigation para atender ao enunciado do trabalho; não há roteamento por arquivos.

## Verificação

```bash
npm run typecheck
npm run lint
npx expo-doctor
npx expo export --platform all
```

Roteiro manual no Expo Go:

1. Abra a ficha e diminua/aumente a vida. Confira os limites 0 e 28.
2. Volte ao início, reabra a ficha e confira que a vida foi mantida.
3. Abra o diário, favorite/desfavorite uma anotação e teste o filtro.
4. Crie uma anotação. Campos vazios devem exibir uma mensagem.
5. Salve título e texto válidos. Confira a anotação na lista e o contador no início.
6. Teste voltar, cancelar e digitar com o teclado aberto.

A compilação Android/iOS não substitui o teste físico no Expo Go.
