import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "historial";

export type Item = { id: string; contenido: string };

export async function agregarElemento(id: string, contenido: string) {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    const historial: Item[] = jsonValue != null ? JSON.parse(jsonValue) : [];
    historial.push({ id, contenido });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(historial));
  }
  catch (e) {
    console.error("Error guardando historial:", e);
  }
}

export async function obtenerHistorial(): Promise<Item[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    const historial: Item[] = jsonValue != null ? JSON.parse(jsonValue) : [];
    return historial;
  }
  catch (e) {
    console.error("Error leyendo historial:", e);
    return [];
  }
}

export async function obtenerItem(id: string): Promise<Item | null> {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        const historial: Item[] = jsonValue != null ? JSON.parse(jsonValue) : [];
        const item = historial.find(item => item.id === id);
        return item ?? null;
    }
    catch (e) {
        console.error("Error leyendo historial:", e);
        return null;
    }
}
