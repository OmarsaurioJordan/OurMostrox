import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import AppLayout from "../components/AppLayout";
import { MonsterCard } from "../components/monster_card";
import { Monster } from "../data/Monster";
import { getMonsters } from "../data/monster_service";
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

      <TouchableOpacity
        style={styles.btnAccion}
        onPress={() => router.push("/Create")}
      >
        <Text style={styles.btnText}>Crear Monstruo</Text>
      </TouchableOpacity>
    </AppLayout>
  );
}
