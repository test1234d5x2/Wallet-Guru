import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import setPageTitle from "@/components/pageTitle/setPageTitle";

export default function AccountOverview() {

    setPageTitle("Account Overview")

    const handleChangePassword = () => {
        console.log("Change Password Pressed")
    };

    const handleLogOut = () => {
        console.log("Log Out Pressed")
    };

    const handleDeleteAccount = () => {
        console.log("Delete Account Pressed")
    };

    return (
        <View style={styles.container}>
            <Ionicons name="person-circle-outline" size={100} color="black" />

            <Text style={styles.emailText}>UserEmail@email.com</Text>

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
    );
};

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
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
})