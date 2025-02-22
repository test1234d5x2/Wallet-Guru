import setPageTitle from "@/components/pageTitle/setPageTitle";
import TopBar from "@/components/topBars/topBar";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from 'expo-router';
import clearRouterHistory from "@/utils/clearRouterHistory";
import getToken from "@/utils/tokenAccess/getToken";
import getGoalByID from "@/utils/apiCalls/getGoalByID";
import Goal from "@/models/Goal";
import isNumeric from "@/utils/validation/validateNumeric";




async function updateCurrentProgress(token: string, id: string, current: number): Promise<boolean> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const UPDATE_GOAL_PROGRESS_URL = `http://${API_DOMAIN}/api/goals/${id}/progress`;

    const response = await fetch(UPDATE_GOAL_PROGRESS_URL, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id,
            current
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    };

    return true;
}



export default function UpdateGoal() {
    setPageTitle("Update Goal");

    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [goal, setGoal] = useState<Goal>();
    const [amount, setAmount] = useState<string>("");
    const [error, setError] = useState<string>("");

    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to view your dashboard.');
            clearRouterHistory(router);
            router.replace("/loginPage");
            return;
        }

        setToken(data.token);
        setEmail(data.email);
    });

    useEffect(() => {
        async function getGoal() {
            getGoalByID(token, id as string).then((data) => {
                setGoal(data);
            }).catch((error: Error) => {
                Alert.alert("Goal Not Found")
                console.log(error.message);
                clearRouterHistory(router);
                router.replace("/allGoalsPage");
            })
        }

        if (token) getGoal();
    }, [token]);

    const handleUpdateProgress = () => {
        if (!isNumeric(amount)) {
            Alert.alert("The amount entered must be a number.");
            setError("The amount entered must be a number.");
            return;
        }

        if (!goal) return

        const amountValue = parseFloat(amount);


        goal.updateCurrent(amountValue);
        updateCurrentProgress(token, id as string, goal.current).then((complete) => {
            if (complete) {
                Alert.alert("Success", "Goal progress updated successfully!");
                clearRouterHistory(router);
                router.replace("/allGoalsPage");
                setError("");
            }
        }).catch((error: Error) => {
            Alert.alert("Error", "Failed to update goal progress.");
            console.log(error.message);
        })
    };

    const handleHelpClick = () => {
        Alert.alert(
            "Update Current Goal Status",
            "To update your progress, enter the amount you have added to your fund. If you have taken money out of the fund, you can enter a negative number."
        );
        return;
    };

    return (
        <View style={styles.container}>
            <TopBar />

            {!goal ? "": 
            <View>
                <Text style={styles.label}>Goal: {goal.title}</Text>
                <Text style={styles.label}>Target: £{goal.target.toFixed(2)}</Text>
                <Text style={styles.label}>Current: £{goal.current.toFixed(2)}</Text>
            </View>}

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
    );
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
        fontSize: 16,
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
});
