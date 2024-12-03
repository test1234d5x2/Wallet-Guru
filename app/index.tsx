import { Text, View, StyleSheet, Dimensions } from "react-native";
import { Link } from "expo-router";

const styles = StyleSheet.create({
    root: {
        backgroundColor: "white",
        minHeight: Dimensions.get("window")['height'],
    }
});

export default function Index() {

    return (
        <View style={styles.root}>
            <Link href={"/menu"}>
                <Text>Menu</Text>
            </Link>

            <Link href={"/login"}>
                <Text>Login</Text>
            </Link>
        </View>
    );
}
