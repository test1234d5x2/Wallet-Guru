import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import ExpenseCategoryInputs from '@/components/formComponents/expenseCategoryInputs';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';

export default function AddExpenseCategory() {

    setPageTitle("Add Expense Category")

    const [categoryName, setCategoryName] = useState<string>('')
    const [monthlyLimit, setMonthlyLimit] = useState<string>('')
    const [error, setError] = useState<string>('')

    const validateForm = () => {
        const limit = parseFloat(monthlyLimit);
        if (!categoryName.trim()) {
            setError('Category name cannot be empty.')
            return false
        }
        if (isNaN(limit) || limit <= 0) {
            setError('Monthly Limit must be a positive figure.')
            return false
        }
        setError('')
        return true
    };

    const handleAddCategory = () => {
        if (validateForm()) {
            Alert.alert('Success', `Category "${categoryName}" added with a limit of £${monthlyLimit}`)
            setCategoryName('')
            setMonthlyLimit('')
        }
    };

    return (
        <View style={styles.container}>
            <TopBar />

            <ExpenseCategoryInputs categoryName={categoryName} monthlyLimit={monthlyLimit} setCategoryName={setCategoryName} setMonthlyLimit={setMonthlyLimit} />            

            {error === '' ? null: <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
                <Text style={styles.addButtonText}>Add Category</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        minHeight: Dimensions.get("window").height,
        rowGap: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});