import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Monster } from "./Monster";

const STORAGE_KEY = "monsters";

// cargar
export async function getMonsters(): Promise<Monster[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  }
  catch (e) {
    console.error("Error cargando monstruos", e);
    return [];
  }
}

// guardar
export async function saveMonster(newMonster: Monster): Promise<void> {
  try {
    const monsters = await getMonsters();
    monsters.push(newMonster);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(monsters));
  }
  catch (e) {
    console.error("Error guardando monstruo", e);
  }
}

// buscar id
export async function getMonsterById(id: string): Promise<Monster | null> {
  const monsters = await getMonsters();
  return monsters.find((m) => m.id === id) || null;
}

// guardar imagen
export async function getMonsterImagePath(id: string): Promise<string | null> {
  const path = `${FileSystem.documentDirectory!}img_${id}.png`;
  try {
    const info = await FileSystem.statAsync(path);
    return info.exists ? path : null;
  }
  catch {
    return null;
  }
}
