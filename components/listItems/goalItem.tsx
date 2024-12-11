import Goal from "@/models/Goal";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";


interface GoalItemProps {
    goal: Goal
}


export default function GoalItem(props: GoalItemProps) {

    const router = useRouter()

    const handleUpdate = (id: string) => {
        router.navigate("/updateGoalPage")
        return
    }

    const handleDelete = (id: string) => {
        Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
                console.log('Goal deleted')
                router.replace("/allGoalsPage")
            } },
        ])
    }

    return (
        <View style={styles.goalContainer}>
            <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>{props.goal.title}</Text>
                <Text style={styles.goalTarget}>Target: £{props.goal.target}</Text>
            </View>
            <Text style={styles.progressLabel}>Progress</Text>
            <Progress.Bar progress={props.goal.calculateProgress()} color="#007BFF" width={null} />
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleUpdate(props.goal.id)}>
                    <Ionicons name="pencil-outline" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(props.goal.id)}>
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    goalContainer: {
        rowGap: 15,
    },
    goalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    goalTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    goalTarget: {
        fontSize: 16,
    },
    progressLabel: {
        fontSize: 14,
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    editButton: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    deleteButton: {
        backgroundColor: "#FF4C4C",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
})