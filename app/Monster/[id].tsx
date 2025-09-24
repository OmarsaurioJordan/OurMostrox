import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Monster } from "../../data/Monster";

export default function MonsterDetail() {
  const { id } = useLocalSearchParams(); // ← obtiene el ID de la ruta
  const [monster, setMonster] = useState<Monster | null>(null);

  useEffect(() => {
    const loadMonster = async () => {
      try {
        const stored = await AsyncStorage.getItem("monsters");
        if (stored) {
          const monsters: Monster[] = JSON.parse(stored);
          const found = monsters.find((m) => m.id === id);
          setMonster(found || null);
        }
      } catch (err) {
        console.error("Error al cargar monstruo:", err);
      }
    };
    loadMonster();
  }, [id]);

  if (!monster) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Monstruo no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{monster.nombre}</Text>
      <Image source={{ uri: monster.imagen }} style={styles.image} />
      <Text style={styles.description}>{monster.descripcion}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push(`/Fight?id=${monster.id}`)}
      >
        <Text style={styles.buttonText}>⚔️ Luchar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#6a5acd" }]}
        onPress={() => router.push(`/Breed?id=${monster.id}`)}
      >
        <Text style={styles.buttonText}>💞 Cruce</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ff6347",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
