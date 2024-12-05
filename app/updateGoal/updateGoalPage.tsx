import setPageTitle from "@/components/pageTitle/setPageTitle";
import TopBar from "@/components/topBars/topBar";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";


export default function UpdateGoal() {

    setPageTitle("Update Goal")

    const [amount, setAmount] = useState<string>("")
    const [error, setError] = useState<string>("")

    const handleUpdateProgress = () => {
        if (!/^-?\d+(\.\d+)?$/.test(amount)) {
            Alert.alert("The amount entered must be a number.")
            setError("The amount entered must be a number.")
            return;
        }
        setError("");
        console.log("Progress updated with amount:", parseFloat(amount))
    }

    const handleHelpClick = () => [
        Alert.alert("Update Current Goal Status", "To update your progress, enter the amount you have added to your fund. If you have taken money out of the fund, you can enter a negative number.")
    ]

    return (
        <View style={styles.container}>

            <TopBar />

            <Text style={styles.label}>Goal: Goal Name</Text>
            <Text style={styles.label}>Target: £2500</Text>
            <Text style={styles.label}>Current: £1000</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Amount Added/Removed"
                    placeholderTextColor={"rgba(0,0,0,0.25)"}
                    value={amount}
                    onChangeText={(text) => setAmount(text)}
                    keyboardType="numeric"
                />

                <TouchableOpacity>
                    <Ionicons name="help-circle-outline" size={24} color="black" onPress={handleHelpClick} />
                </TouchableOpacity>
            </View>

            

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
        rowGap: 20,
    },
    label: {
        fontSize: 16,
        marginVertical: 5,
    },
    inputContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        fontSize: 16,
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginTop: 10,
    },
    updateButton: {
        backgroundColor: "#007BFF",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 20,
    },
    updateButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
})