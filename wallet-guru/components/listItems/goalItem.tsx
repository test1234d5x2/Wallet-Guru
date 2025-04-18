import Goal from "@/models/core/Goal"
import { View, Text, StyleSheet, Alert } from 'react-native'
import * as Progress from 'react-native-progress'
import { useRouter } from "expo-router"
import ListItemEditButton from "./listItemEditButton"
import ListItemDeleteButton from "./listItemDeleteButton"
import clearRouterHistory from "@/utils/clearRouterHistory"
import deleteGoal from "@/utils/apiCalls/deleteGoal"


interface GoalItemProps {
    goal: Goal
    token: string
}


export default function GoalItem(props: GoalItemProps) {

    const router = useRouter()

    const handleUpdate = (id: string) => {
        router.navigate(`/updateGoalPage/${props.goal.getID()}`)
        return
    }

    const handleDelete = (id: string) => {
        Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: () => {
                    deleteGoal(props.token, id).then((complete) => {
                        if (complete) {
                            Alert.alert('Success', 'Goal deleted successfully!')
                            clearRouterHistory(router)
                            router.replace("/allGoalsPage")
                        }
                    }).catch((err: Error) => {
                        Alert.alert("Failed", "Failed to delete goal.")
                        console.log(err.message)
                    })
                }
            },
        ])
    }

    return (
        <View style={styles.goalContainer}>
            <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>{props.goal.title}</Text>
                <Text style={styles.goalTarget}>Target: £{props.goal.target.toFixed(2)}</Text>
            </View>
            <Text style={styles.progressLabel}>Progress</Text>
            <Progress.Bar progress={props.goal.calculateProgress()} color={props.goal.calculateProgress() >= 1 ? "#54B835": "#007BFF"} width={null} />
            <View style={styles.actionsContainer}>
                <ListItemEditButton id={props.goal.getID()} handleEdit={handleUpdate} />
                <ListItemDeleteButton id={props.goal.getID()} handleDelete={handleDelete} />
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