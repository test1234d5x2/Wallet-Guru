import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import Expense from '@/models/Expense';
import ExpenseCategory from '@/models/ExpenseCategory';
import User from '@/models/User';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';



export default function ExpenseDetailsScreen() {

    const user = new User("", "")
    const expense = new Expense(user, "Expense Name", -25.5, new Date(), "", new ExpenseCategory(user, "Food", 250, 1000))
    

    setPageTitle(expense.title)

    const router = useRouter()

    const handleEdit = () => {
        router.navigate("/editExpensePage")
        return
    }

    const handleDelete = () => {
        Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
                console.log('Expense deleted')
                router.replace("/listTransactionsPage")
            } },
        ])
    }

    const handleViewReceipt = () => {
        Alert.alert("Needs Implementing")
    }

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
    )
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
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
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
})