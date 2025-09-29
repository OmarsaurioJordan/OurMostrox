import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import AppLayout from "../components/AppLayout";
import { MonsterCard } from "../components/monster_card";
import { Monster } from "../data/Monster";
import { getMonsters, handleImport, saveMonster } from "../data/monster_service";
import { styles } from "../data/styles";

export default function Gallery() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadMonsters();
  }, []);

  const loadMonsters = async () => {
    const data = await getMonsters();
    setMonsters(data);
  };

  return (
    <AppLayout title="Galería de Monstruos" showBack>
      <FlatList
        data={monsters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MonsterCard item={item} />
        )}
        numColumns={2}
        contentContainerStyle={styles.monsterList}
      />

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.btnRow}
          onPress={async () => {
            const monster = await handleImport();
            if (monster) {
              await saveMonster(monster);
              router.replace(`/Monster/${monster.id}`);
            }
          }}>
          <Text style={styles.btnText}>Importar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnRow}
          onPress={() => router.replace("/Create")}
        >
          <Text style={styles.btnText}>Crear</Text>
        </TouchableOpacity>
      </View>

    </AppLayout>
  );
}
