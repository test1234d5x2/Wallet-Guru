import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Progress from 'react-native-progress';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Registry from '@/models/Registry';
import clearRouterHistory from '@/utils/clearRouterHistory';

export default function ViewGoalDetails() {
    const { id } = useLocalSearchParams();

    const registry = Registry.getInstance();
    const authenticatedUser = registry.getAuthenticatedUser();
    const router = useRouter();


    if (!authenticatedUser) {
        Alert.alert("Error", "You must be logged in to view this goal.");
        clearRouterHistory(router);
        router.replace("/loginPage");
        return null;
    }


    const goal = registry.getAllGoalsByUser(authenticatedUser).find(g => g.getID() === id);


    if (!goal) {
        Alert.alert("Error", "Goal not found.");
        clearRouterHistory(router);
        router.replace("/allGoalsPage");
        return null;
    }

    setPageTitle(goal.title);

    const handleUpdateProgress = () => {
        router.navigate("/updateGoalPage/" + goal.getID());
    }

    const handleDeleteGoal = () => {
        Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
                try {
                    registry.deleteGoal(goal.getID());
                    Alert.alert('Success', 'Goal deleted successfully!');
                    clearRouterHistory(router);
                    router.replace("/allGoalsPage");
                } catch (err: any) {
                    Alert.alert('Error', err.message);
                }
            } },
        ])
    }

    return (
        <View style={styles.container}>
            <TopBar />

            <Text style={styles.label}>Target: £{goal.target.toFixed(2)}</Text>

            <View style={{ rowGap: 5 }}>
                <Text style={styles.label}>Current: £{goal.current.toFixed(2)}</Text>
                <Progress.Bar progress={goal.calculateProgress()} color="#007BFF" width={null} />
            </View>

            <Text style={styles.label}>Description: {goal.description}</Text>

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.editButton} onPress={handleUpdateProgress}>
                    <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteGoal}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
        rowGap: 30,
    },
    label: {
        fontSize: 16,
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
      },
      editButton: {
        flex: 1,
        backgroundColor: "#007BFF",
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: "center",
        marginHorizontal: 10,
        marginLeft: 0,
      },
      deleteButton: {
        flex: 1,
        backgroundColor: "#FF4C4C",
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: "center",
        marginHorizontal: 10,
        marginRight: 0,
      },
      buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      },
});