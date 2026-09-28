import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Routes } from "../navigation";
import { type Character, getClass } from "../data/codex";
import { Button } from "../components/Button";
import { colors, styles } from "../styles";
export function HomeScreen({
  navigation,
  characters,
}: NativeStackScreenProps<Routes, "Home"> & { characters: Character[] }) {
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.page}>
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={{ gap: 20 }}>
            <View style={{ gap: 10 }}>
              <Text style={styles.eyebrow}>
                ENGENHARIA DE REQUISITOS EM JOGO
              </Text>
              <Text style={styles.title}>
                Sua próxima jornada começa com uma ficha.
              </Text>
              <Text style={styles.subtitle}>
                Conheça sua classe e aprenda a transformar necessidades em
                soluções.
              </Text>
            </View>
            <Image
              source={require("../../assets/images/codex-banner.png")}
              resizeMode="cover"
              accessibilityLabel="Livro geométrico sobre um fundo violeta e ciano"
              style={{
                width: "100%",
                height: 130,
                borderRadius: 12,
                borderWidth: 0,
                borderColor: colors.border,
              }}
            />
            <Button
              title="Criar ficha"
              onPress={() => navigation.navigate("CreateCharacter")}
            />
            <Button
              secondary
              title="Conhecer as classes"
              onPress={() => navigation.navigate("Classes")}
            />
            <Button
              secondary
              title="Guia do sistema"
              onPress={() => navigation.navigate("Guide")}
            />
            <Text style={styles.notice}>
              Fichas e anotações ficam apenas nesta sessão. Ao recarregar o app,
              as alterações são perdidas.
            </Text>
            <Text style={styles.section}>
              Minhas fichas · {characters.length}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.example && (
              <Text style={styles.eyebrow}>EXEMPLO PARA CONSULTA</Text>
            )}
            <Text style={styles.section}>{item.name}</Text>
            <Text style={styles.subtitle}>
              {getClass(item.classId).name} · Nível 1
            </Text>
            {!!item.project && <Text style={styles.body}>{item.project}</Text>}
            <Button
              title={`Abrir ficha de ${item.name}`}
              onPress={() =>
                navigation.navigate("Character", { characterId: item.id })
              }
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
