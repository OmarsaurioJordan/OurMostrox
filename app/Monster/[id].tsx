import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import AppLayout from "../../components/AppLayout";
import { Monster } from "../../data/Monster";
import { getMonsterById, getMonsterImagePath } from "../../data/monster_service";
import { styles } from "../../data/styles";

export default function MonsterDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [monster, setMonster] = useState<Monster | null>(null);
  const [imgPath, setImgPath] = useState<string | null>(null);

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
      const path = await getMonsterImagePath(m.id);
      setImgPath(path);
    };
    loadData();
  }, [id]);

  if (!monster) return null;

  return (
    <AppLayout title="Ficha de Monstruo" showBack>

      <Image
        source={ imgPath ? { uri: imgPath } : require("../assets/images/default_card.png") }
        style={styles.bigImageMonster}
      />
      <Text style={styles.header}>{monster.nombre}</Text>
      <Text style={styles.description}>{monster.descripcion}</Text>

      <TouchableOpacity
        style={styles.btnAccion}
        onPress={() => router.push(`/Gallery`)}>
        <Text style={styles.btnText}>📦 Exportar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnAccion}
        onPress={() => router.push(`./Fight/${monster.id}`)}>
        <Text style={styles.btnText}>⚔️ Luchar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnAccion}
        onPress={() => {/* lógica para eliminar */}}>
        <Text style={styles.btnText}>🗑️ Eliminar</Text>
      </TouchableOpacity>

      <View style={styles.twoLabels}>
        <View style={styles.oneLabels}>
          <Text style={styles.miniText}>{monster.descripcion}</Text>
          <TouchableOpacity onPress={() => {/* copiar descripción */}}>
            <Text style={styles.btnText}>Copiar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.oneLabels}>
          <Text style={styles.miniText}>{monster.prompt_img}</Text>
          <TouchableOpacity onPress={() => {/* copiar prompt imagen */}}>
            <Text style={styles.btnText}>Copiar</Text>
          </TouchableOpacity>
        </View>
      </View>

    </AppLayout>
  );
}
