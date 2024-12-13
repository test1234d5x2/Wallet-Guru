import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import setPageTitle from "@/components/pageTitle/setPageTitle";
import { useRouter, useNavigation } from "expo-router";
import User from "@/models/User";

export default function AccountOverview() {

    setPageTitle("Account Overview")

    const router = useRouter()

    const user = new User("UserEmail@email.com", "")

    const handleChangePassword = () => {
        console.log("Change Password Pressed")
    }

    const handleLogOut = () => {
        while (router.canGoBack()) {router.back()}
        router.replace("/loginPage")
    }

    const handleDeleteAccount = () => {
        Alert.alert('Delete Account', 'Are you sure you want to delete your account?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
                console.log("Account Deleted")
                router.dismissAll()
                router.navigate("/")
            } },
        ])
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
})