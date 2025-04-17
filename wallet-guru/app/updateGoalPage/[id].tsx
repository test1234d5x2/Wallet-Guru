import setPageTitle from "@/components/pageTitle/setPageTitle"
import TopBar from "@/components/topBars/topBar"
import { Ionicons } from "@expo/vector-icons"
import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert, StatusBar } from "react-native"
import { useRouter, useLocalSearchParams } from 'expo-router'
import clearRouterHistory from "@/utils/clearRouterHistory"
import getToken from "@/utils/tokenAccess/getToken"
import getGoalByID from "@/utils/apiCalls/getGoalByID"
import Goal from "@/models/core/Goal"
import isNumeric from "@/utils/validation/validateNumeric"
import updateGoal from "@/utils/apiCalls/updateGoal"
import NumericInputField from "@/components/formComponents/inputFields/numericInputField"

export default function UpdateGoal() {
    setPageTitle("Update Goal")

    const { id } = useLocalSearchParams()
    const router = useRouter()
    const [token, setToken] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [goal, setGoal] = useState<Goal>()
    const [amount, setAmount] = useState<string>("")
    const [error, setError] = useState<string>("")

    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to access this page.')
            clearRouterHistory(router)
            router.replace("/loginPage")
            return
        }

        setToken(data.token)
        setEmail(data.email)
    })

    useEffect(() => {
        async function getGoal() {
            getGoalByID(token, id as string).then((data) => {
                setGoal(data)
            }).catch((error: Error) => {
                Alert.alert("Goal Not Found")
                console.log(error.message)
                clearRouterHistory(router)
                router.replace("/allGoalsPage")
            })
        }

        if (token) getGoal()
    }, [token])

    const handleUpdateProgress = () => {
        if (!isNumeric(amount)) {
            setError("The amount entered must be a number.")
            return
        }

        if (!goal) return

        const amountValue = parseFloat(amount)

        goal.updateCurrent(amountValue)
        updateGoal(token, id as string, goal.current).then((complete) => {
            if (complete) {
                Alert.alert("Success", "Goal progress updated successfully!")
                clearRouterHistory(router)
                router.replace("/allGoalsPage")
                setError("")
            }
        }).catch((error: Error) => {
            setError(error.message)
        })
    }

    const handleHelpClick = () => {
        Alert.alert(
            "Update Current Goal Status",
            "To update your progress, enter the amount you have added to your fund. If you have taken money out of the fund, you can enter a negative number."
        )
    }

    return (
        <View style={styles.container}>
            <TopBar />
            <StatusBar barStyle={"dark-content"} />

            {goal && (
                <View style={{ rowGap: 15 }}>
                    <Text style={styles.label}>Goal: {goal.title}</Text>
                    <Text style={styles.label}>Target: £{goal.target.toFixed(2)}</Text>
                    <Text style={styles.label}>Current: £{goal.current.toFixed(2)}</Text>
                </View>
            )}

            <View style={styles.inputContainer}>
                <NumericInputField value={amount} setValue={setAmount} placeholder={"Amount Added/Removed"} />
                <TouchableOpacity onPress={handleHelpClick}>
                    <Ionicons name="help-circle-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProgress}>
                <Text style={styles.updateButtonText}>Update Progress</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
        rowGap: 30,
    },
    label: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        columnGap: 15,
        width: "80%",
    },
    errorText: {
        color: "red",
        fontSize: 14,
    },
    updateButton: {
        backgroundColor: "#007BFF",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    updateButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
})
