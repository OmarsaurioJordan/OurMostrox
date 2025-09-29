import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#490e0eff"
    },
    banner: {
        width: "100%",
        height: 80,
        resizeMode: "cover"
    },
    header: {
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10
    },
    btnBack: {
        padding: 5,
        backgroundColor: "#9e5b34ff",
        borderRadius: 8
    },
    title: {
        flex: 1,
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff"
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#fff"
    },
    mainImage: {
        height: "50%",
        aspectRatio: 4 / 5,
        resizeMode: "cover",
        marginBottom: 20,
        borderRadius: 32
    },
    content: {
        flex: 1,
        padding: 16
    },
    mainContent: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    btnAccion: {
        marginTop: 15,
        padding: 15,
        borderRadius: 15,
        backgroundColor: "#9e5b34ff",
        alignItems: "center"
    },
    btnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 20
    },
    monsterCard: {
        flex: 1,
        margin: 8,
        backgroundColor: "#723f21ff",
        borderRadius: 12,
        padding: 12,
        alignItems: "center"
    },
    monsterImage: {
        height: 150,
        aspectRatio: 4 / 5,
        resizeMode: "cover",
        borderRadius: 8,
        marginBottom: 8
    },
    monsterTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 6,
        flexWrap: "wrap"
    },
    monsterList: {
        gap: 12
    },
    credits: {
        color: "#fff",
        textAlign: "center",
        fontSize: 14,
        padding: 30
    },
    inputLabel: {
        fontSize: 18,
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 10
    },
    inputTxt: {
        width: "80%",
        padding: 10,
        borderWidth: 1,
        color: "#fff",
        borderColor: "#b96565ff",
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 16,
        textAlign: "center"
    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginBottom: 12
    },
    inputGenero: {
        borderWidth: 1,
        borderColor: "#b96565ff",
        padding: 5,
        borderRadius: 8,
        marginBottom: 10,
        width: "45%"
    },
    textGenero: {
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        margin: 5
    },
    selected: {
        backgroundColor: "#a59032ff",
        borderColor: "#ee7878ff"
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 5,
        justifyContent: "space-between"
    },
    scroll: {
        flex: 1
    },
    scrollContent: {
        padding: 12
    },
    questionBlock: {
        marginBottom: 20
    },
    option: {
        width: "30%",
        aspectRatio: 1.25,
        borderWidth: 1,
        borderColor: "#b96565ff",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        backgroundColor: "#723f21ff"
    },
    optionText: {
        fontSize: 16,
        color: "#fff",
        textAlign: "center"
    },
    optionImage: {
        width: "80%",
        height: 60,
        marginBottom: 6,
        resizeMode: "contain",
        alignSelf: "center"
    },
    description: {
        flex: 1,
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center"
    },
    manyLabels: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
        margin: 20,
        gap: 25
    },
    miniFondo: {
        marginTop: 1,
        padding: 1,
        borderRadius: 15,
        backgroundColor: "#b96565ff",
        alignItems: "center"
    },
    miniBtn: {
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
        maxWidth: "60%"
    },
    mainMonsterImage: {
        height: "45%",
        aspectRatio: 4 / 5,
        resizeMode: "cover",
        marginBottom: 20,
        borderRadius: 32,
        alignSelf: "center"
    },
    btnRow: {
        marginTop: 15,
        padding: 15,
        borderRadius: 15,
        backgroundColor: "#9e5b34ff",
        alignItems: "center",
        flex:1
    }
})
