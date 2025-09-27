import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "api_keys";
const DEFAULT_KEYS: ApiKeys = {
  apiKeyTxt: "smETMRheLGOllrunruTAhlcKZ5TjCYRj",
  apiKeyImg: "",
};

export interface ApiKeys {
  apiKeyTxt: string;
  apiKeyImg: string;
}

// guardar
export async function saveApiKeys(keys: ApiKeys) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  }
  catch (e) {
    console.error("Error guardando API keys", e);
  }
}

// cargar
export async function loadApiKeys(): Promise<ApiKeys | null> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : DEFAULT_KEYS;
  }
  catch (e) {
    console.error("Error cargando API keys", e);
    return DEFAULT_KEYS;
  }
}
