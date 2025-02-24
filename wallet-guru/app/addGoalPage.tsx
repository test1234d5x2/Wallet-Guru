import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import GoalDetailsInputs from '@/components/formComponents/goalDetailsInputs';
import validateEmpty from '@/utils/validation/validateEmpty';
import isNumeric from '@/utils/validation/validateNumeric';
import { useRouter } from 'expo-router';
import { isValidDate, isTodayOrAfter } from '@/utils/validation/validateDate';
import GoalStatus from '@/enums/GoalStatus';
import clearRouterHistory from '@/utils/clearRouterHistory';
import getToken from '@/utils/tokenAccess/getToken';




async function addGoal(token: string, title: string, description: string, target: number, targetDate: Date, status: GoalStatus) {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const ADD_GOAL_URL = `http://${API_DOMAIN}/api/goals/`

    const response = await fetch(ADD_GOAL_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            description,
            target,
            targetDate,
            status
        })
    });    

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }
}





export default function AddGoal() {
    setPageTitle("Add Goal");

    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [target, setTarget] = useState<string>('');
    const [date, setDate] = useState<Date | null>(null);
    const [description, setDesc] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();

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

    const validateForm = () => {
        if (!title || !target || !date) {
            Alert.alert('Please fill in all required fields.');
            setError("Fill in all the required fields.");
            return false;
        }

        if (validateEmpty(title)) {
            Alert.alert("Empty Title Field", "The title field must be filled properly.");
            setError("The title field must be filled properly.");
            return false;
        }

        if (validateEmpty(target)) {
            Alert.alert("Empty Target Field", "The target field must be filled properly.");
            setError("The target field must be filled properly.");
            return false;
        }

        if (!isNumeric(target)) {
            Alert.alert("Target Field Not Numeric", "The target field must be a number.");
            setError("The target field must be a number.");
            return false;
        }

        if (!isValidDate(date)) {
            Alert.alert("Date Field Invalid", "Please select a date.");
            setError("Please select a date.");
            return false;
        }

        if (!isTodayOrAfter(date)) {
            Alert.alert("Date Field Invalid", "Please select a date that is today or after today.");
            setError("Please select a date that is today or after today.");
            return false;
        }

        setError("");
        return true;
    };

    const handleAddGoal = () => {
        if (validateForm()) {
            addGoal(token, title, description, parseFloat(target), date as Date, GoalStatus.Active).then((data) => {
                Alert.alert('Success', 'Goal added successfully!');
                clearRouterHistory(router);
                router.replace("/allGoalsPage");
            }).catch((error: Error) => {
                Alert.alert("Error Adding Goal");
                console.log(error.message)
            })
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TopBar />

            <View style={styles.goalForm}>
                <GoalDetailsInputs
                    title={title}
                    target={target}
                    date={date}
                    description={description}
                    setTitle={setTitle}
                    setTarget={setTarget}
                    setDate={setDate}
                    setDesc={setDesc}
                />
            </View>

            {error ? <View style={styles.centeredTextContainer}><Text style={styles.errorText}>{error}</Text></View> : null}

            <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
                <Text style={styles.addButtonText}>Add Goal</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        rowGap: 20,
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
    },
    goalForm: {
        marginBottom: 40,
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    centeredTextContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: 'red',
        fontSize: 14,
    },
});
