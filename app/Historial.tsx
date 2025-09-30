import { useEffect, useState } from "react";
import {
    FlatList, ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import AppLayout from "../components/AppLayout";
import { Item, obtenerHistorial } from "../data/historial";
import { styles } from "../data/styles";

export default function Historial() {
    const [historial, setHistorial] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    useEffect(() => {
        const loadHistorial = async () => {
            const historial: Item[] = await obtenerHistorial();
            setHistorial(historial);
        };
        loadHistorial();
    }, []);

    return (
    <AppLayout title="Historial" showBack>
        
        <View style={{ height: "45%" }}>
        <FlatList
            data={historial}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <TouchableOpacity
                style={styles.monsterCard}
                    onPress={() => setSelectedItem(item)}>
                <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.description}>
                {item.contenido}
                </Text>
            </TouchableOpacity>
            )}
        />
        </View>

        <View style={{ height: "45%"}}>
        <ScrollView contentContainerStyle={{ padding: 10 }}>
            {selectedItem ? (
            <Text style={styles.description}>{selectedItem.contenido}</Text>
            ) : (
            <Text style={styles.description}>Selecciona una tarjeta para ver la narrativa de lucha completa</Text>
            )}
        </ScrollView>
        </View>

    </AppLayout>
    );
}
