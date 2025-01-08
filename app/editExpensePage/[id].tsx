import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import ExpenseDetailsInputs from '@/components/formComponents/expenseDetailsInputs';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import validateEmpty from '@/utils/validateEmpty';
import isNumeric from '@/utils/validateNumeric';
import { isValidDate, isTodayOrBefore } from '@/utils/validateDate';
import Registry from '@/models/Registry';
import ExpenseCategory from '@/models/ExpenseCategory';


export default function EditExpense() {
    const { id } = useLocalSearchParams();

    const router = useRouter()

    const registry = Registry.getInstance()
    const authenticatedUser = registry.getAuthenticatedUser()

    if (!authenticatedUser) {
        Alert.alert("Error", "You must be logged in to edit an expense.")
        router.replace("/loginPage")
        return
    }

    setPageTitle("Edit Expense")



    const [title, setTitle] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [date, setDate] = useState<Date>(new Date())
    const [category, setCategory] = useState<ExpenseCategory>(new ExpenseCategory(authenticatedUser, "Other", 10000))
    const [notes, setNotes] = useState<string>('')
    const [error, setError] = useState<string>('')


    const expense = registry.getAllExpensesByUser(authenticatedUser).find(exp => exp.getID() === id);
    if (!expense) {
        Alert.alert("Error", "Expense does not exist.")
        router.replace("/listTransactionsPage")
        return
    }

    setTitle(expense.title)
    setAmount(expense.amount.toString())
    setDate(new Date(expense.date))
    setCategory(expense.expenseCategory)
    setNotes(expense.notes)




    const validateForm = () => {
        if (!title || !amount || !date || !category) {
            Alert.alert('Please fill in all required fields.')
            setError("Fill in all the required fields.")
            return false
        }

        if (validateEmpty(title)) {
            Alert.alert("Empty Title Field", "The title field must be filled properly.")
            setError("The title field must be filled properly.")
            return false
        }

        if (validateEmpty(amount)) {
            Alert.alert("Empty Amount Field", "The amount field must be filled properly.")
            setError("The amount field must be filled properly.")
            return false
        }

        if (!isNumeric(amount)) {
            Alert.alert("Amount Field Not Numeric", "The amount field must be a number.")
            setError("The amount field must be a number.")
            return false
        }

        if (!isValidDate(date)) {
            Alert.alert("Date Field Invalid", "Please select a date.")
            setError("Please select a date.")
            return false
        }

        if (!isTodayOrBefore(date)) {
            Alert.alert("Date Field Invalid", "Please select a date that is today or before today.")
            setError("Please select a date that is today or before today.")
            return false
        }

        setError("")
        return true
    }

    const handleEditExpense = () => {
        if (validateForm()) {
            try {
                registry.updateExpense(id as string, title, parseFloat(amount), date, notes, category as ExpenseCategory)
                Alert.alert('Success', 'Expense updated successfully!')
                router.replace("/viewExpenseDetailsPage/" + expense.getID())
            } catch (err: any) {
                Alert.alert("Error", err.message)
            }
        }
    }

    const handleScanReceipt = () => {
        Alert.alert('Feature Coming Soon', 'Receipt scanning is not yet implemented.')
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TopBar />

            <View style={styles.expenseForm}>
                <ExpenseDetailsInputs
                    title={title}
                    amount={amount}
                    date={date}
                    category={category}
                    notes={notes}
                    categoriesList={registry.getAllExpenseCategoriesByUser(authenticatedUser).map(cat => cat.name)}
                    setTitle={setTitle}
                    setAmount={setAmount}
                    setDate={setDate}
                    setCategory={setCategory}
                    setNotes={setNotes}
                />
            </View>

            {error ? <View style={styles.centeredTextContainer}><Text style={styles.errorText}>{error}</Text></View> : null}

            <View style={styles.centeredTextContainer}>
                <TouchableOpacity onPress={handleScanReceipt}>
                    <Text style={styles.scanText}>Scan Receipt</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleEditExpense}>
                <Text style={styles.addButtonText}>Edit Expense</Text>
            </TouchableOpacity>
        </ScrollView>
    )
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
})
