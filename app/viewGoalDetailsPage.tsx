import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Progress from 'react-native-progress';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { useRouter } from 'expo-router';
import User from '@/models/User';
import Goal from '@/models/Goal';
import GoalStatus from '@/enums/GoalStatus';


export default function ViewGoalDetails() {

    const user = new User("", "")
    const goal = new Goal("Goal Title", user, "khdfbjhdasjhdajshb", 2500, GoalStatus.Active)
    goal.updateCurrent(1000)

    setPageTitle(goal.title)

    const router = useRouter()

    const handleUpdateProgress = () => {
        router.navigate("/updateGoalPage")
        return
    }

    const handleDeleteGoal = () => {
        Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
                console.log('Goal deleted')
                router.replace("/allGoalsPage")
            } },
        ])
    }


    return (
        <View style={styles.container}>
            <TopBar />

            <Text style={styles.label}>Target: £{goal.target}</Text>

            <View style={{rowGap: 5}}>
                <Text style={styles.label}>Current: £{goal.current}</Text>
                <Progress.Bar progress={goal.calculateProgress()} color="#007BFF" width={null} />
            </View>

            <Text style={styles.label}>Deadline: {/* NEED TO ADD A DEADLINE ATTRIBUTE TO GOAL. */}</Text>

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
})