import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Routes } from "../../App";
import type { Note } from "../data/mock";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";
import { colors, styles } from "../styles";

export function NotesScreen({
  navigation,
  notes,
  onToggleFavorite,
}: NativeStackScreenProps<Routes, "Notes"> & {
  notes: Note[];
  onToggleFavorite: (id: string) => void;
}) {
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.page}>
      <FlatList
        data={onlyFavorites ? notes.filter((note) => note.favorite) : notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={{ gap: 16 }}>
            <Text style={styles.eyebrow}>ECOS DA FLORESTA</Text>
            <Text style={styles.title}>Memórias da jornada</Text>
            <Text style={styles.subtitle}>
              Cada pista pode mudar o rumo da história.
            </Text>
            <Button
              title="+ Nova anotação"
              onPress={() => {
                setOnlyFavorites(false);
                navigation.navigate("NewNote");
              }}
            />
            <View style={styles.row}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: !onlyFavorites }}
                onPress={() => setOnlyFavorites(false)}
                style={[styles.button, onlyFavorites && styles.secondaryButton]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    onlyFavorites && styles.secondaryText,
                  ]}
                >
                  Todas
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: onlyFavorites }}
                onPress={() => setOnlyFavorites(true)}
                style={[
                  styles.button,
                  !onlyFavorites && styles.secondaryButton,
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    !onlyFavorites && styles.secondaryText,
                  ]}
                >
                  Favoritas
                </Text>
              </Pressable>
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={[styles.eyebrow, styles.grow]}>{item.session}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${item.favorite ? "Desfavoritar" : "Favoritar"} ${item.title}`}
                accessibilityState={{ selected: item.favorite }}
                onPress={() => onToggleFavorite(item.id)}
                style={{
                  minWidth: 44,
                  minHeight: 44,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#8B631C", fontSize: 26 }}>
                  {item.favorite ? "★" : "☆"}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.section}>{item.title}</Text>
            <Text style={styles.body}>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.card}>
            <Text style={styles.section}>Nenhuma favorita ainda</Text>
            <Text style={styles.subtitle}>
              Toque na estrela de uma anotação para encontrá-la aqui.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

export function NewNoteScreen({
  navigation,
  onSave,
}: NativeStackScreenProps<Routes, "NewNote"> & {
  onSave: (title: string, text: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  function save() {
    if (!title.trim() || !text.trim()) {
      setError("Preencha o título e a anotação.");
      return;
    }
    onSave(title.trim(), text.trim());
    navigation.goBack();
  }
  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <Screen>
        <Text style={styles.eyebrow}>UMA NOVA PÁGINA</Text>
        <Text style={styles.title}>O que aconteceu?</Text>
        <Text style={styles.subtitle}>
          Registre uma descoberta, um encontro ou o resumo da sessão.
        </Text>
        <Text style={styles.label}>Título</Text>
        <TextInput
          accessibilityLabel="Título"
          value={title}
          onChangeText={setTitle}
          placeholder="Ex.: A pista nas ruínas"
          placeholderTextColor={colors.muted}
          maxLength={80}
          style={styles.input}
        />
        <Text style={styles.label}>Anotação</Text>
        <TextInput
          accessibilityLabel="Anotação"
          value={text}
          onChangeText={setText}
          placeholder="Escreva sua memória da aventura…"
          placeholderTextColor={colors.muted}
          multiline
          maxLength={2000}
          textAlignVertical="top"
          style={[styles.input, { minHeight: 180 }]}
        />
        {!!error && (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        )}
        <Button title="Salvar anotação" onPress={save} />
        <Button
          secondary
          title="Cancelar"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.subtitle}>
          As anotações ficam disponíveis enquanto o app estiver aberto.
        </Text>
      </Screen>
    </KeyboardAvoidingView>
  );
}
