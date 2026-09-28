import type { ClassId } from "./data/codex";
export type Routes = {
  Home: undefined;
  Classes: undefined;
  ClassDetail: { classId: ClassId };
  CreateCharacter: { classId?: ClassId } | undefined;
  Character: { characterId: string };
  Guide: undefined;
};
