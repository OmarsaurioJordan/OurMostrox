import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { Monster } from "../data/Monster";
import { getMonsterImagePath, getNivel } from "../data/monster_service";
import { styles } from "../data/styles";

export function MonsterCard({ item, disabled = false }: { item: Monster, disabled?: boolean }) {
  const router = useRouter();
  const [imgPath, setImgPath] = useState<string | null>(null);

  useEffect(() => {
    getMonsterImagePath(item.id).then(setImgPath);
  }, [item.id]);

  return (
    <TouchableOpacity
      style={styles.monsterCard}
      onPress={() => !disabled && router.replace(`/Monster/${item.id}`)}
      disabled={disabled}
    >
      <Image
        source={ imgPath ? { uri: imgPath } : require("../assets/images/default_card.png") }
        style={styles.monsterImage}
      />
      <Text
        style={[styles.monsterTitle, { fontSize: 16 }]}
      >
        lvl {getNivel(item)}
      </Text>
      <Text
        style={styles.monsterTitle}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {item.nombre}
      </Text>
    </TouchableOpacity>
  );
}
