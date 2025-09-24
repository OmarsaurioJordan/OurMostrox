import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity } from "react-native";
import AppLayout from "../components/AppLayout";
import { Monster } from "../data/Monster";
import { styles } from "../data/styles";

export default function Gallery() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadMonsters();
  }, []);

  const loadMonsters = async () => {
    try {
      const json = await AsyncStorage.getItem("monsters");
      if (json) {
        setMonsters(JSON.parse(json));
      }
    }
    catch (e) {
      console.error("Error cargando monstruos", e);
    }
  };

  const renderMonster = ({ item }: { item: Monster }) => (
    <TouchableOpacity
      style={styles.monsterCard}
      onPress={() => router.push(`../Monster/${item.id}`)}
    >
      <Image source={{ uri: item.imagen }} style={styles.monsterImage} />
      <Text style={styles.monsterTitle}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  return (
    <AppLayout title="Galería de Monstruos" showBack>
      
      <FlatList
        data={monsters}
        keyExtractor={(item) => item.id}
        renderItem={renderMonster}
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
