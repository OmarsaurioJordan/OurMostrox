import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View
} from "react-native";
import AppLayout from "../../components/AppLayout";
import { Monster } from "../../data/Monster";
import {
  buildMonsterPrompt, deleteMonster, exportMonster, getMonsterById, getMonsterImagePath
} from "../../data/monster_service";
import { fetchMonsterDescription } from "../../data/prompts";
import { styles } from "../../data/styles";

export default function MonsterDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [monster, setMonster] = useState<Monster | null>(null);
  const [imgPath, setImgPath] = useState<string | null>(null);
  const [monsterPrompt, setMonsterPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        router.replace("/Gallery");
        return null;
      }
      const monsterId = Array.isArray(id) ? id[0] : id;
      const m = await getMonsterById(monsterId as string);
      if (!m) {
        router.replace("/Gallery");
        return null;
      }
      setMonster(m);
      const prompt = buildMonsterPrompt(m);
      setMonsterPrompt(prompt);
      const path = await getMonsterImagePath(m.id);
      setImgPath(path);
      // tratar de actualizar la descripcion creandola con la IA
      if (m.descripcion === "") {
        setLoading(true);
        const updated = await fetchMonsterDescription(m);
        setLoading(false);
        if (updated) {
          setTimeout(() => {
            router.replace(`/Monster/${m.id}`);
          }, 1000);
        }
      }
    };
    loadData();
  }, [id]);

  if (!monster) return null;

  return (
    <AppLayout title="Ficha de Monstruo" showBack>

      <Image
        source={ imgPath ? { uri: imgPath } : require("../../assets/images/default_card.png") }
        style={styles.mainMonsterImage}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.mainContent}>

      <Text style={styles.title}>{monster.nombre}</Text>
      {loading && (
        <ActivityIndicator size="large" color="#cfcc14ff" />
      )}
      <Text style={styles.description}>{monster.descripcion !== "" ?
        monster.descripcion : "La descripción no ha sido generada aún mediante IA, debes esperar a que suceda, siempre que la API key cuente con tokens..."}</Text>

      <View style={styles.manyLabels}>
        <TouchableOpacity
          style={styles.btnAccion}
          onPress={async () => {
            if (!monster) return;
            Alert.alert("Eliminar Monstruo",
              `¿Seguro que quieres eliminar a ${monster.nombre}?`,
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Eliminar", style: "destructive",
                  onPress: async () => {
                    await deleteMonster(monster.id);
                    router.replace("/Gallery");
                  },
                },
              ]
            );
          }}>
          <Text style={styles.btnText}>Eliminar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnAccion}
          onPress={async () => {
            if (monster) {
              try {
                await exportMonster(monster);
                Alert.alert("Éxito", "Monstruo exportado");
              }
              catch (e) {
                console.error("Error exportando monstruo:", e);
                Alert.alert("Error", "No se pudo exportar");
              }
            }
          }}
        >
          <Text style={styles.btnText}>Exportar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnAccion}
          onPress={() => router.replace(`../Fight/${monster.id}`)}>
          <Text style={styles.btnText}>Luchar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.manyLabels}>
          <TouchableOpacity onPress={async () => {
            await Clipboard.setStringAsync(monsterPrompt);
            Alert.alert("Copiado", "prompt para generar la descripción");
          }}
          style={styles.miniFondo}>
            <Text style={styles.miniBtn}>{"Copiar prompt para generar la descripción y el prompt de imágen"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={async () => {
            if (monster.prompt_img !== "") {
              await Clipboard.setStringAsync(monster.prompt_img);
              Alert.alert("Copiado", "prompt para generar la imágen");
            }
            else {
              Alert.alert("Vacío", "la IA descriptiva aún no crea el prompt de imágen");
            }
          }}
          style={styles.miniFondo}>
            <Text style={styles.miniBtn}>{"Copiar prompt para generar la imágen, solo disponible si la IA ya lo creó"}</Text>
          </TouchableOpacity>
      </View>

    </View>
    </ScrollView>
    </AppLayout>
  );
}
