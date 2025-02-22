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

export default function AddGoal() {
    setPageTitle("Add Goal");

    // const [title, setTitle] = useState<string>('');
    // const [target, setTarget] = useState<string>('');
    // const [date, setDate] = useState<Date | null>(null);
    // const [description, setDesc] = useState<string>('');
    // const [error, setError] = useState<string>('');
    // const router = useRouter();

    // const registry = Registry.getInstance();
    // const authService = registry.authService;
    // const goalService = registry.goalService;

    // const user = authService.getAuthenticatedUser();

    // if (!user) {
    //     Alert.alert('Error', 'You must be logged in to add a goal.');
    //     clearRouterHistory(router);
    //     router.replace("/loginPage");
    //     return;
    // }

    // const validateForm = () => {
    //     if (!title || !target || !date) {
    //         Alert.alert('Please fill in all required fields.');
    //         setError("Fill in all the required fields.");
    //         return false;
    //     }

    //     if (validateEmpty(title)) {
    //         Alert.alert("Empty Title Field", "The title field must be filled properly.");
    //         setError("The title field must be filled properly.");
    //         return false;
    //     }

    //     if (validateEmpty(target)) {
    //         Alert.alert("Empty Target Field", "The target field must be filled properly.");
    //         setError("The target field must be filled properly.");
    //         return false;
    //     }

    //     if (!isNumeric(target)) {
    //         Alert.alert("Target Field Not Numeric", "The target field must be a number.");
    //         setError("The target field must be a number.");
    //         return false;
    //     }

    //     if (!isValidDate(date)) {
    //         Alert.alert("Date Field Invalid", "Please select a date.");
    //         setError("Please select a date.");
    //         return false;
    //     }

    //     if (!isTodayOrAfter(date)) {
    //         Alert.alert("Date Field Invalid", "Please select a date that is today or after today.");
    //         setError("Please select a date that is today or after today.");
    //         return false;
    //     }

    //     setError("");
    //     return true;
    // };

    // const handleAddGoal = () => {
    //     if (validateForm()) {
    //         try {
    //             goalService.addGoal(user, title, description, parseFloat(target), GoalStatus.Active);
    //             Alert.alert('Success', 'Goal added successfully!');
    //             setTitle('');
    //             setTarget('');
    //             setDate(null);
    //             setDesc('');
    //             clearRouterHistory(router);
    //             router.replace("/allGoalsPage");
    //         } catch (error: any) {
    //             Alert.alert("Error", error.message);
    //         }
    //     }
    // };

    // return (
    //     <ScrollView contentContainerStyle={styles.container}>
    //         <TopBar />

    //         <View style={styles.goalForm}>
    //             <GoalDetailsInputs
    //                 title={title}
    //                 target={target}
    //                 date={date}
    //                 description={description}
    //                 setTitle={setTitle}
    //                 setTarget={setTarget}
    //                 setDate={setDate}
    //                 setDesc={setDesc}
    //             />
    //         </View>

    //         {error ? <View style={styles.centeredTextContainer}><Text style={styles.errorText}>{error}</Text></View> : null}

    //         <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
    //             <Text style={styles.addButtonText}>Add Goal</Text>
    //         </TouchableOpacity>
    //     </ScrollView>
    // );
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
