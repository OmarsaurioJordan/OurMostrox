import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppLayout from "../../components/AppLayout";
import { loadApiKeys, saveApiKeys } from "../../data/api_keys";
import { styles } from "../../data/styles";

export default function Home() {
  const [apiKeyTxt, setApiKeyTxt] = useState("");
  const [apiKeyImg, setApiKeyImg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const keys = await loadApiKeys();
      if (keys) {
        setApiKeyTxt(keys.apiKeyTxt);
        setApiKeyImg(keys.apiKeyImg);
      }
    };
    init();
  }, []);

  useEffect(() => {
    saveApiKeys({ apiKeyTxt, apiKeyImg });
  }, [apiKeyTxt, apiKeyImg]);

  return (
    <AppLayout title="" showBack={false}>
      <View style={styles.mainContent}>

        {/* titulo e imagen */}
        <Text style={styles.mainTitle}>Our Mostrox</Text>
        <Image
          source={require("../../assets/images/monsters.png")}
          style={styles.mainImage}
        />

        {/* input texto IA */}
        <Text style={styles.inputLabel}>API key de Mistral AI</Text>
        <TextInput
          style = {styles.inputTxt}
          value = {apiKeyTxt}
          onChangeText = {setApiKeyTxt}
          placeholder = "digita la API key aquí"
          placeholderTextColor="#c42727ff"
        />

        {/* input imagen IA */}
        <Text style={styles.inputLabel}>API key de StableDifusion AI</Text>
        <TextInput
          style = {styles.inputTxt}
          value = {apiKeyImg}
          onChangeText = {setApiKeyImg}
          placeholder = "digita la API key aquí"
          placeholderTextColor="#c42727ff"
        />

        {/* boton galeria */}
        <View style={styles.menuLabels}>
          <TouchableOpacity
            style={styles.btnAccion}
            onPress={() => router.replace("/Historial")}
          >
            <Text style={styles.btnText}>Ver Historial</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.btnAccion}
            onPress={() => router.replace("/Gallery")}
          >
            <Text style={styles.btnText}>Ver Galería</Text>
          </TouchableOpacity>
        </View>

        {/* creditos */}
        <Text style={styles.credits}>by Omwekiatl 2025</Text>

      </View>
    </AppLayout>
  );
}
