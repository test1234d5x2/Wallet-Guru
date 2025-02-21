import setPageTitle from "@/components/pageTitle/setPageTitle";
import TopBar from "@/components/topBars/topBar";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from 'expo-router';
import clearRouterHistory from "@/utils/clearRouterHistory";

export default function UpdateGoal() {
    setPageTitle("Update Goal");

    const router = useRouter();
    const { id } = useLocalSearchParams();

    // const registry = Registry.getInstance();
    // const authService = registry.authService;
    // const goalService = registry.goalService;

    // const authenticatedUser = authService.getAuthenticatedUser();

    // if (!authenticatedUser) {
    //     clearRouterHistory(router);
    //     Alert.alert("Error", "You must be logged in to update a goal.");
    //     router.replace("/loginPage");
    //     return;
    // }

    // const goal = goalService.getAllGoalsByUser(authenticatedUser).find(g => g.getID() === id);

    // if (!goal) {
    //     clearRouterHistory(router);
    //     Alert.alert("Error", "Goal not found.");
    //     router.replace("/allGoalsPage");
    //     return;
    // }

    // const [amount, setAmount] = useState<string>("");
    // const [error, setError] = useState<string>("");

    // const handleUpdateProgress = () => {
    //     if (!/^-?\d+(\.\d+)?$/.test(amount)) {
    //         Alert.alert("The amount entered must be a number.");
    //         setError("The amount entered must be a number.");
    //         return;
    //     }

    //     const amountValue = parseFloat(amount);
    //     try {
    //         goalService.updateGoal(
    //             goal.getID(),
    //             goal.title,
    //             goal.description,
    //             goal.target,
    //             goal.current + amountValue,
    //             goal.status
    //         );
    //         Alert.alert("Success", "Goal progress updated successfully!");
    //         clearRouterHistory(router);
    //         router.replace("/allGoalsPage");
    //     } catch (err: any) {
    //         Alert.alert("Error", err.message);
    //     }
    //     setError("");
    // };

    // const handleHelpClick = () => {
    //     Alert.alert(
    //         "Update Current Goal Status",
    //         "To update your progress, enter the amount you have added to your fund. If you have taken money out of the fund, you can enter a negative number."
    //     );
    //     return;
    // };

    // return (
    //     <View style={styles.container}>
    //         <TopBar />

    //         <Text style={styles.label}>Goal: {goal.title}</Text>
    //         <Text style={styles.label}>Target: £{goal.target.toFixed(2)}</Text>
    //         <Text style={styles.label}>Current: £{goal.current.toFixed(2)}</Text>

    //         <View style={styles.inputContainer}>
    //             <TextInput
    //                 style={styles.input}
    //                 placeholder="Amount Added/Removed"
    //                 placeholderTextColor={"rgba(0,0,0,0.25)"}
    //                 value={amount}
    //                 onChangeText={(text) => setAmount(text)}
    //                 keyboardType="numeric"
    //             />

    //             <TouchableOpacity>
    //                 <Ionicons name="help-circle-outline" size={24} color="black" onPress={handleHelpClick} />
    //             </TouchableOpacity>
    //         </View>

    //         {error ? <Text style={styles.errorText}>{error}</Text> : null}

    //         <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProgress}>
    //             <Text style={styles.updateButtonText}>Update Progress</Text>
    //         </TouchableOpacity>
    //     </View>
    // );
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
