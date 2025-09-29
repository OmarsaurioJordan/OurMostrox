import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView, Text, TouchableOpacity, View
} from "react-native";
import AppLayout from "../../components/AppLayout";
import { MonsterCard } from "../../components/monster_card";
import { Monster } from "../../data/Monster";
import {
  getMonsterById, getVoidMonster
} from "../../data/monster_service";
import { ParamOption, TERRENOS } from "../../data/parametros";
import { styles } from "../../data/styles";

export default function MonsterFight() {
  
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [monster, setMonster] = useState<Monster>(getVoidMonster());
  const [retador, setRetador] = useState<Monster>(getVoidMonster());
  const [terreno, setTerreno] = useState<number>(0); 

  const handleSelect = (optionId: number) => {
    setTerreno((prevTerreno) => {
      return prevTerreno === optionId ? 0 : optionId;
    });
  };

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
    };
    loadData();
  }, [id]);

  if (!monster) return null;
  
  return (
    <AppLayout title="Lucha de Monstruos" showBack>
      
      <FlatList
        data={[ monster, retador ]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MonsterCard item={item} />
        )}
        numColumns={2}
        contentContainerStyle={styles.monsterList}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.mainContent}>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.btnRow}
          onPress={() => {}}
        >
          <Text style={styles.btnText}>Last</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnRow}
          onPress={() => {}}
        >
          <Text style={styles.btnText}>Importar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnRow}
          onPress={() => {}}
        >
          <Text style={styles.btnText}>Next</Text>
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

      </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.btnAccion}
        onPress={() => {}}
      >
        <Text style={styles.btnText}>¡¡¡ Luchar !!!</Text>
      </TouchableOpacity>

    </AppLayout>
  );
}
