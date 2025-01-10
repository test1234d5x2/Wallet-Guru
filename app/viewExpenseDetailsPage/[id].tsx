import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import clearRouterHistory from '@/utils/clearRouterHistory';
import Registry from '@/models/data/Registry';

export default function ExpenseDetailsScreen() {
    const { id } = useLocalSearchParams();

    const registry = Registry.getInstance();
    const authService = registry.authService;
    const expenseService = registry.expenseService;

    const authenticatedUser = authService.getAuthenticatedUser();

    const router = useRouter();

    if (!authenticatedUser) {
        Alert.alert("Error", "You must be logged in to view this expense.");
        clearRouterHistory(router);
        router.replace("/loginPage");
        return;
    }

    const expense = expenseService.getAllExpensesByUser(authenticatedUser).find(exp => exp.getID() === id);

    if (!expense) {
        Alert.alert("Error", "Expense not found.");
        clearRouterHistory(router);
        router.replace("/listTransactionsPage");
        return;
    }

    setPageTitle(expense.title);

    const handleEdit = () => {
        router.navigate("/editExpensePage/" + expense.getID());
    };

    const handleDelete = () => {
        Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: () => {
                    try {
                        expenseService.deleteExpense(expense.getID());
                        Alert.alert('Success', 'Expense deleted successfully!');
                        clearRouterHistory(router);
                        router.replace("/listTransactionsPage");
                    } catch (err: any) {
                        Alert.alert('Error', err.message);
                    }
                },
            },
        ]);
    };

    const handleViewReceipt = () => {
        Alert.alert("Feature Coming Soon", "Receipt viewing is not yet implemented.");
    };

    return (
        <View style={styles.mainContainer}>
            <TopBar />
            <View style={styles.container}>
                <Text style={styles.detail}>Category: {expense.expenseCategory.name}</Text>
                <Text style={styles.detail}>Amount: £{Math.abs(expense.amount).toFixed(2)}</Text>
                <Text style={styles.detail}>Date: {expense.date.toDateString()}</Text>
                <View>
                    <Text style={styles.notesTitle}>Notes:</Text>
                    <Text style={styles.notes}>{expense.notes}</Text>
                </View>

                <TouchableOpacity onPress={handleViewReceipt}>
                    <Text style={styles.viewReceipt}>View Receipt</Text>
                </TouchableOpacity>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    detail: {
        fontSize: 16,
        marginBottom: 10,
    },
    notesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 5,
    },
    notes: {
        fontSize: 14,
        color: '#555',
    },
    viewReceipt: {
        marginTop: 20,
        fontSize: 16,
        color: '#007BFF',
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    button: {
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#007BFF',
    },
    deleteButton: {
        backgroundColor: '#FF4C4C',
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
});
