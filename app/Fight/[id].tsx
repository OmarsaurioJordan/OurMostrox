import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView, Text, TouchableOpacity, View
} from "react-native";
import AppLayout from "../../components/AppLayout";
import { MonsterCard } from "../../components/monster_card";
import { obtenerItem } from "../../data/historial";
import { Monster } from "../../data/Monster";
import {
  getMonsterById,
  getMonsters,
  getVoidMonster, handleImport
} from "../../data/monster_service";
import { ParamOption, TERRENOS } from "../../data/parametros";
import { fetchMonsterFight, getFightId, getFightPrompt } from "../../data/prompts";
import { styles } from "../../data/styles";

export default function MonsterFight() {
  
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [monster, setMonster] = useState<Monster>(getVoidMonster());
  const [retador, setRetador] = useState<Monster>(getVoidMonster());
  const [terreno, setTerreno] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [resultado, setResultado] = useState<string>("");

  const handleSelect = (optionId: number) => {
    setTerreno((prevTerreno) => {
      return prevTerreno === optionId ? 0 : optionId;
    });
  };

  function retadorAzar(): void {
    if (monsters.length <= 1) return;
    let nuevoRetador: Monster;
    do {
      nuevoRetador = monsters[Math.floor(Math.random() * monsters.length)];
    }
    while (nuevoRetador.id === monster.id);
    setRetador(nuevoRetador);
  }

  function retadorNext(addition: boolean): void {
    if (!retador || retador.nombre === "") {
      retadorAzar();
      return;
    }
    const index = monsters.findIndex(m => m.id === retador.id);
    if (index === -1) return;
    let nextIndex = addition
      ? (index == monsters.length - 1 ? 0 : index + 1)
      : (index == 0 ? monsters.length - 1 : index - 1);
    // evitar que sea el mismo que monster
    if (monsters[nextIndex].id === monster.id) {
      nextIndex = addition
        ? (nextIndex == monsters.length - 1 ? 0 : nextIndex + 1)
        : (nextIndex == 0 ? monsters.length - 1 : nextIndex - 1);
    }
    setRetador(monsters[nextIndex]);
  }

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
      setMonsters(await getMonsters());
    };
    loadData();
  }, [id]);

  useEffect(() => {
    retadorAzar();
  }, [monster, monsters]);

  if (!monster) return null;
  
  return (
    <AppLayout title="Lucha de Monstruos" showBack>
      
      <View style={{ height: 270 }}>
        <FlatList
          data={[ monster, retador ]}
          extraData={ retador }
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MonsterCard item={item} disabled={true} />
          )}
          numColumns={2}
          style={{ flexShrink: 1 }}
          contentContainerStyle={styles.monsterList}
        />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.mainContent}>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.btnRow}
          onPress={() => { retadorNext(false) }}
        >
          <Text style={styles.btnText}>Ant.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnRow}
          onPress={async () => {
            const m = await handleImport();
            if (m) {
              setRetador(m);
              setMonsters(await getMonsters());
            }
          }}
        >
          <Text style={styles.btnText}>Importar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnRow}
          onPress={() => { retadorNext(true) }}
        >
          <Text style={styles.btnText}>Sig.</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.questionBlock}>
        <Text style={styles.inputLabel}>Escenario</Text>
        <View style={styles.grid}>
          {TERRENOS.map((opt: ParamOption) => {
            const selected = terreno === opt.id;
            if (opt.id != 0) {
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.option, selected && styles.selected]}
                  onPress={() => handleSelect(opt.id)}
                >
                  <Image source={opt.imagen} style={styles.optionImage}/>
                  <Text style={styles.optionText}>{opt.nombre}</Text>
                </TouchableOpacity>
              );
            }
          })}
        </View>
      </View>

      {loading && (
        <ActivityIndicator size="large" color="#cfcc14ff" />
      )}
      <Text style={styles.description}>{resultado !== "" ?
        resultado : "La lucha no ha sido generada aún mediante IA, debes pulsar el botón y esperar a que suceda, siempre que la API key cuente con tokens..."}</Text>

      <Text>.</Text>
      <TouchableOpacity onPress={async () => {
          await Clipboard.setStringAsync(getFightPrompt(monster, retador, terreno));
          Alert.alert("Copiado", "prompt para generar la lucha");
        }}
        style={styles.miniFondo}>
        <Text style={styles.miniBtn}>{"Copiar prompt para generar la lucha"}</Text>
      </TouchableOpacity>

      </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.btnAccion}
        onPress={async () => {
          const fight_id = getFightId(monster, retador, terreno);
          let item = await obtenerItem(fight_id);
          if (item) {
            setResultado(item.contenido);
          }
          else {
            setLoading(true);
            const updated = await fetchMonsterFight(monster, retador, terreno);
            setLoading(false);
            if (updated) {
              item = await obtenerItem(fight_id);
              if (item) {
                setResultado(item.contenido);
              }
            }
          }
        }}
      >
        <Text style={styles.btnText}>¡¡¡ Luchar !!!</Text>
      </TouchableOpacity>

    </AppLayout>
  );
}
