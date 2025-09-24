import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../data/styles";

type Props = {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
};

export default function AppLayout({ children, title, showBack = false }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Banner */}
      <Image source={require("../assets/images/banner.png")} style={styles.banner} />

      {/* Header */}
      <View style={styles.header}>
        {showBack ? (
            <TouchableOpacity onPress={() => router.back()} style={styles.btnBack}>
                <Text style={styles.btnText}>⬅️</Text>
            </TouchableOpacity>
        ) : (
            <View style={{ width: 40 }} />
        )}
        <Text style={styles.title}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Contenido */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}
