import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import setPageTitle from "@/components/pageTitle/setPageTitle";
import { useRouter } from "expo-router";
import Registry from "@/models/Registry";
import clearRouterHistory from "@/utils/clearRouterHistory";

export default function AccountOverview() {

    setPageTitle("Account Overview")

    const router = useRouter();
    const registry = Registry.getInstance();
    const user = registry.getAuthenticatedUser();

    if (!user) {
        clearRouterHistory(router);
        router.replace("/loginPage");
        return null;
    }

    const handleChangePassword = () => {
        console.log("Change Password Pressed");
    }

    const handleLogOut = () => {
        registry.logoutUser();
        clearRouterHistory(router);
        router.replace("/loginPage");
    }

    const handleDeleteAccount = () => {
        Alert.alert('Delete Account', 'Are you sure you want to delete your account?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
                registry.logoutUser();
                registry.deleteUser(user.getUserID());
                clearRouterHistory(router);
                router.replace("/");
            } },
        ]);
    }

    return (
        <View style={styles.container}>
            <Ionicons name="person-circle-outline" size={100} color="black" />

            <Text style={styles.emailText}>{user.getEmail()}</Text>

            <TouchableOpacity style={styles.buttonPrimary} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogOut}>
                <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonDanger} onPress={handleDeleteAccount}>
                <Text style={styles.buttonText}>Delete Account</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 20,
        flex: 1,
        rowGap: 30,
    },
    emailText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    buttonPrimary: {
        backgroundColor: "#007BFF",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        width: "80%",
        alignItems: "center",
    },
    buttonDanger: {
        backgroundColor: "#FF4C4C",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        width: "80%",
        alignItems: "center",
        marginTop: 50,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
