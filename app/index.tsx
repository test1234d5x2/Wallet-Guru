import { Text, View, StyleSheet, Dimensions } from "react-native";
import TopBar from "./components/topBar";
import MenuTopBar from "./components/menuTopBar";
import { useNavigation } from "expo-router";

const styles = StyleSheet.create({
    root: {
        backgroundColor: "white",
        minHeight: Dimensions.get("window")['height'],
    }
});

export default function Index() {

    return (
        <View style={styles.root}>
            <MenuTopBar />
        </View>
    );
}
