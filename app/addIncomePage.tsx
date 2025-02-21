import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import IncomeDetailsInputs from '@/components/formComponents/incomeDetailsInputs';
import validateEmpty from '@/utils/validateEmpty';
import isNumeric from '@/utils/validateNumeric';
import { useRouter } from 'expo-router';
import { isValidDate, isTodayOrBefore } from '@/utils/validateDate';
import clearRouterHistory from '@/utils/clearRouterHistory';

export default function AddIncome() {
    setPageTitle("Add Income");

    // const [title, setTitle] = useState<string>('');
    // const [amount, setAmount] = useState<string>('');
    // const [date, setDate] = useState<Date | null>(null);
    // const [notes, setNotes] = useState<string>('');
    // const [error, setError] = useState<string>('');
    // const router = useRouter();

    // const registry = Registry.getInstance();
    // const authService = registry.authService;
    // const incomeService = registry.incomeService;

    // const user = authService.getAuthenticatedUser();

    // if (!user) {
    //     Alert.alert('Error', 'You must be logged in to add an income.');
    //     clearRouterHistory(router);
    //     router.replace("/loginPage");
    //     return;
    // }

    // const validateForm = () => {
    //     if (!title || !amount || !date) {
    //         Alert.alert('Please fill in all required fields.');
    //         setError("Fill in all the required fields.");
    //         return false;
    //     }

    //     if (validateEmpty(title)) {
    //         Alert.alert("Empty Title Field", "The title field must be filled properly.");
    //         setError("The title field must be filled properly.");
    //         return false;
    //     }

    //     if (validateEmpty(amount)) {
    //         Alert.alert("Empty Amount Field", "The amount field must be filled properly.");
    //         setError("The amount field must be filled properly.");
    //         return false;
    //     }

    //     if (!isNumeric(amount)) {
    //         Alert.alert("Amount Field Not Numeric", "The amount field must be a number.");
    //         setError("The amount field must be a number.");
    //         return false;
    //     }

    //     if (!isValidDate(date)) {
    //         Alert.alert("Date Field Invalid", "Please select a date.");
    //         setError("Please select a date.");
    //         return false;
    //     }

    //     if (!isTodayOrBefore(date)) {
    //         Alert.alert("Date Field Invalid", "Please select a date that is today or before today.");
    //         setError("Please select a date that is today or before today.");
    //         return false;
    //     }

    //     setError("");
    //     return true;
    // };

    // const handleAddIncome = () => {
    //     if (validateForm()) {
    //         try {
    //             incomeService.addIncome(user, title, parseFloat(amount), date as Date, notes);
    //             Alert.alert('Success', 'Income added successfully!');
    //             setTitle('');
    //             setAmount('');
    //             setDate(null);
    //             setNotes('');
    //             clearRouterHistory(router);
    //             router.replace("/listTransactionsPage");
    //         } catch (error: any) {
    //             Alert.alert("Error", error.message);
    //         }
    //     }
    // };

    // return (
    //     <ScrollView contentContainerStyle={styles.container}>
    //         <TopBar />

    //         <View style={styles.incomeForm}>
    //             <IncomeDetailsInputs
    //                 title={title}
    //                 amount={amount}
    //                 date={date}
    //                 notes={notes}
    //                 setTitle={setTitle}
    //                 setAmount={setAmount}
    //                 setDate={setDate}disc
    //                 setNotes={setNotes}
    //             />
    //         </View>

    //         {error ? <View style={styles.centeredTextContainer}><Text style={styles.errorText}>{error}</Text></View> : null}

    //         <TouchableOpacity style={styles.addButton} onPress={handleAddIncome}>
    //             <Text style={styles.addButtonText}>Add Income</Text>
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
    incomeForm: {
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
