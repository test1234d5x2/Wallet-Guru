import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Progress from 'react-native-progress';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import clearRouterHistory from '@/utils/clearRouterHistory';
import Goal from '@/models/Goal';
import getToken from '@/utils/tokenAccess/getToken';
import getGoalByID from '@/utils/getGoalByID';


export default function ViewGoalDetails() {
    const { id } = useLocalSearchParams();

    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [goal, setGoal] = useState<Goal>();

    setPageTitle(!goal ? "": goal.title);

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
        if (!goal) {
            clearRouterHistory(router);
            router.navigate("/loginPage");
            return;
        }
        router.navigate("/updateGoalPage/" + goal.getID());
    };

    const handleDeleteGoal = () => {
        Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: () => {
                    try {
                        // DELETE GOAL USING TOKEN AND EMAIL VIA API.
                        Alert.alert('Success', 'Goal deleted successfully!');
                        clearRouterHistory(router);
                        router.replace("/allGoalsPage");
                    } catch (err: any) {
                        Alert.alert('Error', err.message);
                    }
                },
            },
        ]);
    };

    return (
        <View style={styles.mainContainer}>
            <TopBar />

            {!goal ? "": <View style={styles.container}>
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
            </View>}

        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: "white",
        rowGap: 20
    },
    container: {
        backgroundColor: '#fff',
        rowGap: 20
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
