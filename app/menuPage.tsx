import { View, StyleSheet } from "react-native";
import MainMenu from "@/components/menuComponents/menu";
import setPageTitle from "@/components/pageTitle/setPageTitle";


export default function Menu() {

    setPageTitle("Menu")

    return (
        <View style={styles.container}>
            <MainMenu />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
        rowGap: 20,
    },
})