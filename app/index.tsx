import { Text, View, StyleSheet, Dimensions } from "react-native";
import Page from "../components/page";

const styles = StyleSheet.create({
    root: {
        backgroundColor: "white",
        minHeight: Dimensions.get("window")['height'],
    }
});

export default function Index() {

    return (
        <View style={styles.root}>
            <Page></Page>
        </View>
    );
}
