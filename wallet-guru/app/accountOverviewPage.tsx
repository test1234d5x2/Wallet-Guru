import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import setPageTitle from "@/components/pageTitle/setPageTitle"
import { useRouter } from "expo-router"
import clearRouterHistory from "@/utils/clearRouterHistory"
import getToken from "@/utils/tokenAccess/getToken"
import removeToken from "@/utils/tokenAccess/deleteToken"
import deleteUser from "@/utils/apiCalls/deleteUser"

export default function AccountOverview() {
    setPageTitle("Account Overview")

    const router = useRouter()
    const [token, setToken] = useState<string>("")
    const [email, setEmail] = useState<string>("")

    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to access this page')
            clearRouterHistory(router)
            router.replace("/loginPage")
            return
        }

        setToken(data.token)
        setEmail(data.email)
    })

    const handleChangePassword = () => {
        clearRouterHistory(router)
        router.replace("/changePasswordPage")
    }

    const handleLogOut = () => {
        removeToken()
        clearRouterHistory(router)
        router.replace("/loginPage")
        return
    }

    const handleDeleteAccount = () => {
        Alert.alert('Delete Account', 'Are you sure you want to delete your account?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: () => {
                    deleteUser(token, email)
                    removeToken()
                    clearRouterHistory(router)
                    router.replace("/")
                    return
                }
            }
        ])
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle={"dark-content"} />
            <Ionicons name="person-circle-outline" size={100} color="black" />

            <Text style={styles.emailText}>{email}</Text>

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
        rowGap: 30
    },
    emailText: {
        fontSize: 16,
        fontWeight: "bold"
    },
    buttonPrimary: {
        backgroundColor: "#007BFF",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        width: "80%",
        alignItems: "center"
    },
    buttonDanger: {
        backgroundColor: "#FF4C4C",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        width: "80%",
        alignItems: "center",
        marginTop: 50
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    }
})
