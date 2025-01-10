import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import ExpenseDetailsInputs from '@/components/formComponents/expenseDetailsInputs';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import validateEmpty from '@/utils/validateEmpty';
import isNumeric from '@/utils/validateNumeric';
import { useRouter } from 'expo-router';
import { isTodayOrBefore, isValidDate } from '@/utils/validateDate';
import Registry from '@/models/Registry';
import ExpenseCategory from '@/models/ExpenseCategory';
import clearRouterHistory from '@/utils/clearRouterHistory';

export default function AddExpense() {

    setPageTitle("Add Expense")

    const router = useRouter()
    const registry = Registry.getInstance()
    const user = registry.getAuthenticatedUser()

    if (!user) {
        clearRouterHistory(router);
        router.replace("/loginPage")
        return null
    }

    const categories = registry.getAllExpenseCategoriesByUser(user)

    const [title, setTitle] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [date, setDate] = useState<Date>(new Date())
    const [category, setCategory] = useState<ExpenseCategory>(new ExpenseCategory(user, "Other", 10000))
    const [notes, setNotes] = useState<string>('')
    const [error, setError] = useState<string>('')

    const validateForm = () => {
        if (!title || !amount || !date || !category) {
            Alert.alert('Please fill in all required fields.')
            setError("Fill in all the required fields.")
            return false
        }

        else if (validateEmpty(title)) {
            Alert.alert("Empty Title Field", "The title field must be filled properly.")
            setError("The title field must be filled properly.")
            return false
        }

        else if (validateEmpty(amount)) {
            Alert.alert("Empty Amount Field", "The amount field must be filled properly.")
            setError("The amount field must be filled properly.")
            return false
        }

        else if (!isNumeric(amount)) {
            Alert.alert("Amount Field Not Numeric", "The amount field must be a number.")
            setError("The amount field must be a number.")
            return false
        }

        else if (!isValidDate(date)) {
            Alert.alert("Date Field Invalid", "Please select a date.")
            setError("Please select a date.")
            return false
        }

        else if (!isTodayOrBefore(date)) {
            Alert.alert("Date Field Invalid", "Please select a date that is today or before today.")
            setError("Please select a date that is today or before today.")
            return false
        }

        setError("")
        return true
    }

    const handleAddExpense = () => {
        if (validateForm()) {
            try {

                registry.addExpense(user, title, parseFloat(amount), date, notes, category)
                Alert.alert('Success', 'Expense added successfully!')
                setTitle('')
                setAmount('')
                setDate(new Date())
                setCategory(categories[0])
                setNotes('')
                clearRouterHistory(router);
                router.replace("/listTransactionsPage")
            } catch (error: any) {
                Alert.alert("Error", error.message)
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
                    categoriesList={categories}
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

            <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
                <Text style={styles.addButtonText}>Add Expense</Text>
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
