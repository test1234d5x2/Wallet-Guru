import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import ExpenseDetailsInputs from '@/components/formComponents/expenseDetailsInputs';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import validateEmpty from '@/utils/validateEmpty';
import isNumeric from '@/utils/validateNumeric';
import { isValidDate, isTodayOrBefore } from '@/utils/validateDate';
import ExpenseCategory from '@/models/ExpenseCategory';
import clearRouterHistory from '@/utils/clearRouterHistory';

export default function EditExpense() {
    setPageTitle("Edit Expense");

    const { id } = useLocalSearchParams();

    // const router = useRouter();
    // const registry = Registry.getInstance();
    // const authService = registry.authService;
    // const expenseService = registry.expenseService;
    // const expenseCategoryService = registry.expenseCategoryService;

    // const authenticatedUser = authService.getAuthenticatedUser();

    // if (!authenticatedUser) {
    //     Alert.alert("Error", "You must be logged in to edit an expense.");
    //     clearRouterHistory(router);
    //     router.replace("/loginPage");
    //     return;
    // }

    // const expense = expenseService.getAllExpensesByUser(authenticatedUser).find(exp => exp.getID() === id);
    // if (!expense) {
    //     Alert.alert("Error", "Expense does not exist.");
    //     router.replace("/listTransactionsPage");
    //     clearRouterHistory(router);
    //     return;
    // }

    // const [title, setTitle] = useState<string>(expense.title);
    // const [amount, setAmount] = useState<string>(expense.amount.toString());
    // const [date, setDate] = useState<Date>(expense.date);
    // const [category, setCategory] = useState<ExpenseCategory>(expense.expenseCategory);
    // const [notes, setNotes] = useState<string>(expense.notes);
    // const [error, setError] = useState<string>('');

    // const validateForm = () => {
    //     if (!title || !amount || !date || !category) {
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

    // const handleEditExpense = () => {
    //     if (validateForm()) {
    //         try {
    //             expenseService.updateExpense(id as string, title, parseFloat(amount), date, notes, category as ExpenseCategory);
    //             Alert.alert('Success', 'Expense updated successfully!');
    //             clearRouterHistory(router);
    //             router.replace("/viewExpenseDetailsPage/" + expense.getID());
    //         } catch (err: any) {
    //             Alert.alert("Error", err.message);
    //         }
    //     }
    // };

    // const handleScanReceipt = () => {
    //     Alert.alert('Feature Coming Soon', 'Receipt scanning is not yet implemented.');
    // };

    // return (
    //     <ScrollView contentContainerStyle={styles.container}>
    //         <TopBar />

    //         <View style={styles.expenseForm}>
    //             <ExpenseDetailsInputs
    //                 title={title}
    //                 amount={amount}
    //                 date={date}
    //                 category={category}
    //                 notes={notes}
    //                 categoriesList={expenseCategoryService.getAllCategoriesByUser(authenticatedUser)}
    //                 setTitle={setTitle}
    //                 setAmount={setAmount}
    //                 setDate={setDate}
    //                 setCategory={setCategory}
    //                 setNotes={setNotes}
    //             />
    //         </View>

    //         {error ? <View style={styles.centeredTextContainer}><Text style={styles.errorText}>{error}</Text></View> : null}

    //         <View style={styles.centeredTextContainer}>
    //             <TouchableOpacity onPress={handleScanReceipt}>
    //                 <Text style={styles.scanText}>Scan Receipt</Text>
    //             </TouchableOpacity>
    //         </View>

    //         <TouchableOpacity style={styles.addButton} onPress={handleEditExpense}>
    //             <Text style={styles.addButtonText}>Edit Expense</Text>
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
    expenseForm: {
        marginBottom: 40,
    },
    scanText: {
        color: '#777',
        textDecorationLine: 'underline',
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
