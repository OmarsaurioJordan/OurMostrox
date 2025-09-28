import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import JSZip from "jszip";
import { Alert } from "react-native";
import { Monster } from "./Monster";
import { PARAMETROS, ParamOption, TITULOS } from "./parametros";
import { basePrompt } from "./prompts";
// @ts-ignore
import { decode as atob } from "base-64";

const STORAGE_KEY = "monsters";
const EXPORT_DIR = new Directory(Paths.document, "exports");

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
    const exists = monsters.some(m => m.id === newMonster.id);
    if (exists) {
      Alert.alert("Advertencia", "Ya existe un monstruo con esa ID");
      return;
    }
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

// eliminar
export async function deleteMonster(id: string): Promise<void> {
  try {
    const monsters = await getMonsters();
    const updated = monsters.filter(m => m.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // borrar imagen asociada
    const imgFile = new File(Paths.document, `img_${id}.png`);
    try {
      const exists = await imgFile.exists;
      if (exists) {
        await imgFile.delete();
        console.log(`Imagen del monstruo ${id} eliminada`);
      }
    }
    catch (e) {
      console.warn(`No se pudo eliminar la imagen del monstruo ${id}:`, e);
    }
  }
  catch (e) {
    console.error("Error eliminando monstruo", e);
  }
}

// guardar imagen
export async function getMonsterImagePath(id: string): Promise<string | null> {
  const imgFile = new File(Paths.document, `img_${id}.png`);
  try {
    const exists = await imgFile.exists;
    return exists ? imgFile.uri : null;
  }
  catch {
    return null;
  }
}

// retorna texto con el genero
export function getMonsterGender(monster: Monster): string {
  return monster.genero === 0 ? "Femenino" : "Masculino";
}

// generar prompt para descripcion
export function buildMonsterPrompt(monster: Monster): string {
  // encabezado
  let res = `# ${monster.nombre} (${getMonsterGender(monster)}):\n`;
  // recorre los parametros
  PARAMETROS.map((options, qIndex) => {
    options.map((opt: ParamOption) => {
        if (opt.id == monster.parametros[qIndex]) {
          if (opt.nombre !== "") {
            res += `## ${TITULOS[qIndex]}:\n- ${opt.nombre}: ${opt.descripcion}\n`;
          }
        }
    });
  });
  return basePrompt.replace("$", res);
}

// exportar un monstruo a zip
export async function exportMonster(monster: Monster): Promise<string | null> {
  try {
    const zip = new JSZip();
    zip.file("monster.json", JSON.stringify(monster, null, 2));
    // si existe imagen, añadirla
    const imgPath = await getMonsterImagePath(monster.id);
    if (imgPath) {
      const imgFile = new File(Paths.document, `img_${monster.id}.png`);
      const imgData = await imgFile.base64();
      zip.file("image.png", imgData, { base64: true });
    }
    const zipData = await zip.generateAsync({ type: "uint8array" });
    // asegurar carpeta export
    await EXPORT_DIR.create({ intermediates: true });
    const zipFile = new File(EXPORT_DIR, `monster_${monster.id}.zip`);
    await zipFile.write(zipData);
    // compartir el archivo
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(zipFile.uri);
    }
    return zipFile.uri;
  }
  catch (e) {
    console.error("Error exportando monstruo:", e);
    return null;
  }
}

// importar un monstruo desde un zip
export async function importMonster(zipUri: string): Promise<Monster | null> {
  try {
    const zipFile = new File(Paths.document, zipUri.split("/").pop()!);
    const data = await zipFile.base64();
    const zip = await JSZip.loadAsync(data, { base64: true });
    // leer JSON
    const jsonStr = await zip.file("monster.json")?.async("string");
    if (!jsonStr) throw new Error("El zip no contiene monster.json");
    const monster: Monster = JSON.parse(jsonStr);
    // guardar imagen si existe
    const imgFile = zip.file("image.png");
    if (imgFile) {
      const imgBase64 = await imgFile.async("base64");
      const outFile = new File(Paths.document, `img_${monster.id}.png`);
      const binaryString = atob(imgBase64);
      const len = binaryString.length;
      const dataUint8Array = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        dataUint8Array[i] = binaryString.charCodeAt(i);
      }
      await outFile.write(dataUint8Array);
    }
    // guardar monstruo
    await saveMonster(monster);
    return monster;
  }
  catch (e) {
    console.error("Error importando monstruo:", e);
    return null;
  }
}

// importar un archivo
export async function handleImport(): Promise<Monster | null> {
  try {
    // abre el selector de archivos, filtrando por archivos ZIP
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/zip',
      copyToCacheDirectory: false,
    });
    // verifica si el usuario selecciono un archivo
    if (result.canceled === false && result.assets && result.assets.length > 0) {
      const zipUri = result.assets[0].uri;
      // intenta abrir el Zip
      const importedMonster = await importMonster(zipUri);
      if (importedMonster) {
        return importedMonster;
      }
      else {
        Alert.alert("Error", "No pudo hacer la importación");
        return null;
      }
    }
    return null;
  }
  catch (e) {
    console.error("Error al seleccionar o importar archivo:", e);
    Alert.alert("Error", "No pudo hacer la importación");
    return null;
  }
};
