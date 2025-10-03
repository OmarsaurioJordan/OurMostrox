import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert, Image, ScrollView, Text, TextInput,
  TouchableOpacity, View
} from "react-native";
import AppLayout from "../components/AppLayout";
import { Monster } from "../data/Monster";
import { saveMonster } from "../data/monster_service";
import { PARAMETROS, ParamOption } from "../data/parametros";
import { styles } from "../data/styles";

// generados de id simple
const generateId = () => Date.now().toString();
const MAX_NAME = 20;

export default function Create() {
  const [nombre, setNombre] = useState("");
  const [genero, setGenero] = useState<0 | 1>(0);
  const [parametros, setParametros] = useState<number[]>(Array(13).fill(0)); 
  const router = useRouter();

  const handleSelect = (questionIndex: number, optionId: number) => {
    setParametros((prev) => {
      const copy = [...prev];
      copy[questionIndex] = copy[questionIndex] === optionId ? 0 : optionId; 
      return copy;
    });
  };

  const saveNewMonster = async () => {
    if (!nombre) {
      Alert.alert("Adevertencia", "Ponle un nombre al monstruo");
      return null;
    }
    if (nombre.length > MAX_NAME) {
      Alert.alert("Advertencia", "El nombre tiene demasiados caracteres");
      return null;
    }
    const newMonster: Monster = {
      id: generateId(),
      nombre,
      genero,
      descripcion: "",
      prompt_img: "",
      parametros
    };
    await saveMonster(newMonster);
    router.replace(`/Monster/${newMonster.id}`);
  };

  const preguntas = [
    "Forma del Cuerpo",
    "Forma de las Piernas",
    "Forma de la Cabeza",
    "En la Cabeza",
    "Tipo de Vestuario",
    "Arma Principal",
    "Herramienta Secundaria",
    "Piel o cobertura",
    "En la Espalda o Atrás",
    "Poder Principal",
    "Habilidad Secundaria",
    "Extra o Compañía",
    "Mente o Emoción",
  ];

  return (
    <AppLayout title="Crear Monstruo" showBack>

      <Text style={styles.inputLabel}>Nombre</Text>
      <View style={styles.row}>
        <TextInput
          value={nombre}
          onChangeText={setNombre}
          style={styles.inputTxt}
          placeholder="Ej: Freddy Krugger"
          placeholderTextColor="#c42727ff"
          maxLength={MAX_NAME}
        />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        <Text style={styles.inputLabel}>Género</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.inputGenero, genero === 0 && styles.selected]}
            onPress={() => setGenero(0)}
          >
            <Text style={styles.textGenero}>♀️ Femenino</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.inputGenero, genero === 1 && styles.selected]}
            onPress={() => setGenero(1)}
          >
            <Text style={styles.textGenero}>♂️ Masculino</Text>
          </TouchableOpacity>
        </View>

        {PARAMETROS.map((options, qIndex) => (
          <View key={qIndex} style={styles.questionBlock}>
            <Text style={styles.inputLabel}>{qIndex + 1}. {preguntas[qIndex]}</Text>
            <View style={styles.grid}>
              {options.map((opt: ParamOption) => {
                const selected = parametros[qIndex] === opt.id;
                if (opt.id != 0) {
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[styles.option, selected && styles.selected]}
                      onPress={() => handleSelect(qIndex, opt.id)}
                    >
                      <Image source={opt.imagen} style={styles.optionImage}/>
                      <Text style={styles.optionText}>{opt.nombre}</Text>
                    </TouchableOpacity>
                  );
              }
              })}
            </View>
          </View>
        ))}

      </ScrollView>

      <TouchableOpacity style={styles.btnAccion} onPress={saveNewMonster}>
        <Text style={styles.btnText}>Crear</Text>
      </TouchableOpacity>
      
    </AppLayout>
  );
}
