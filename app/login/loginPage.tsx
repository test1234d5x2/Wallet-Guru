import { View, Text, StyleSheet, Dimensions } from "react-native";
import LoginForm from "@/components/formComponents/loginForm";

export default function Login() {
    return (
        <View style={styles.container}>
            <LoginForm />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        minHeight: Dimensions.get("window").height,
    },
})