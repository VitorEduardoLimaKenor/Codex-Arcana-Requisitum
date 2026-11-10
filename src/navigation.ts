import { router } from "expo-router";
import type { ClassId } from "./data/codex";
export type Routes = {
  Home: undefined;
  Classes: undefined;
  ClassDetail: { classId: ClassId };
  CreateCharacter: { classId?: ClassId } | undefined;
  Character: { characterId: string };
  Guide: undefined;
};
const paths = {
  Home: "/home",
  Classes: "/classes",
  ClassDetail: "/class-detail",
  CreateCharacter: "/choose",
  Character: "/character",
  Guide: "/guide",
} as const;
export const navigation = {
  navigate: (name: keyof Routes, params?: Routes[keyof Routes]) =>
    router.push({ pathname: paths[name], params }),
  replace: (name: keyof Routes, params?: Routes[keyof Routes]) =>
    router.replace({ pathname: paths[name], params }),
  popToTop: () => router.replace("/home"),
  goBack: () => router.back(),
};
export type ScreenProps<K extends keyof Routes> = {
  navigation: typeof navigation;
  route: { params: Routes[K] };
};
