import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import ExpenseCategoryInputs from '@/components/formComponents/expenseCategoryInputs';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { useRouter } from 'expo-router';


export default function EditExpenseCategory() {

    setPageTitle("Edit Expense Category")

    const [categoryName, setCategoryName] = useState<string>('')
    const [monthlyLimit, setMonthlyLimit] = useState<string>('')
    const [error, setError] = useState<string>('')
    const router = useRouter()

    const validateForm = () => {
        const limit = parseFloat(monthlyLimit)

        if (!categoryName.trim()) {
            setError('Category name cannot be empty.')
            return false
        }

        if (isNaN(limit) || limit <= 0) {
            setError('Monthly Limit must be a positive figure.')
            return false
        }

        setError('')
        router.replace("/expenseCategoriesOverview/expenseCategoriesOverviewPage")

        return true
    };

    const handleEditCategory = () => {
        if (validateForm()) {
            Alert.alert('Success', `Category "${categoryName}" added with a limit of £${monthlyLimit}`)
            setCategoryName('')
            setMonthlyLimit('')
        }
    };

    return (
        <View style={styles.container}>
            <TopBar />

            <View style={styles.expenseCategoryForm}>
                <ExpenseCategoryInputs categoryName={categoryName} monthlyLimit={monthlyLimit} setCategoryName={setCategoryName} setMonthlyLimit={setMonthlyLimit} />
            </View>

            {error === '' ? null: <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.editButton} onPress={handleEditCategory}>
                <Text style={styles.editButtonText}>Edit Category</Text>
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
    expenseCategoryForm: {
        marginBottom: 40,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        textAlign: 'center',
    },
    editButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});