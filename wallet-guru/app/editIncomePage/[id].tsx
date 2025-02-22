import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import IncomeDetailsInputs from '@/components/formComponents/incomeDetailsInputs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import validateEmpty from '@/utils/validation/validateEmpty';
import isNumeric from '@/utils/validation/validateNumeric';
import { isValidDate, isTodayOrBefore } from '@/utils/validation/validateDate';
import clearRouterHistory from '@/utils/clearRouterHistory';

export default function EditIncome() {
    setPageTitle("Edit Income");

    // const { id } = useLocalSearchParams();
    // const router = useRouter();

    // const registry = Registry.getInstance();
    // const authService = registry.authService;
    // const incomeService = registry.incomeService;

    // const authenticatedUser = authService.getAuthenticatedUser();
    // if (!authenticatedUser) {
    //     Alert.alert("Error", "You must be logged in to edit income.");
    //     clearRouterHistory(router);
    //     router.replace("/loginPage");
    //     return;
    // }

    // const income = incomeService.getAllIncomesByUser(authenticatedUser).find(inc => inc.getID() === id);
    // if (!income) {
    //     Alert.alert("Error", "Income not found.");
    //     clearRouterHistory(router);
    //     router.replace("/listTransactionsPage");
    //     return;
    // }

    // const [title, setTitle] = useState<string>(income.title);
    // const [amount, setAmount] = useState<string>(income.amount.toString());
    // const [date, setDate] = useState<Date>(new Date(income.date));
    // const [notes, setNotes] = useState<string>(income.notes);
    // const [error, setError] = useState<string>('');

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

    // const handleEditIncome = () => {
    //     if (validateForm()) {
    //         try {
    //             incomeService.updateIncome(id as string, title, parseFloat(amount), date, notes);
    //             Alert.alert('Success', 'Income updated successfully!');
    //             clearRouterHistory(router);
    //             router.replace("/listTransactionsPage");
    //         } catch (err: any) {
    //             Alert.alert("Error", err.message);
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
    //                 setDate={setDate}
    //                 setNotes={setNotes}
    //             />
    //         </View>

    //         {error ? <View style={styles.centeredTextContainer}><Text style={styles.errorText}>{error}</Text></View> : null}

    //         <TouchableOpacity style={styles.addButton} onPress={handleEditIncome}>
    //             <Text style={styles.addButtonText}>Edit Income</Text>
    //         </TouchableOpacity>
    //     </ScrollView>
    // );
}

const styles = StyleSheet.create({
    container: {
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
