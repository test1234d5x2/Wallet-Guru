import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import ExpenseCategoryInputs from '@/components/formComponents/expenseCategoryInputs';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import validateEmpty from '@/utils/validateEmpty';
import isNumeric from '@/utils/validateNumeric';
import { useRouter } from 'expo-router';

export default function AddExpenseCategory() {

    setPageTitle("Add Expense Category")

    const [categoryName, setCategoryName] = useState<string>('')
    const [monthlyLimit, setMonthlyLimit] = useState<string>('')
    const [error, setError] = useState<string>('')
    const router = useRouter()

    const validateForm = () => {

        if (!categoryName || !monthlyLimit) {
            Alert.alert("Please fill in all the fields.")
            setError("Please fill in all the fields.")
            return false
        }

        else if (validateEmpty(categoryName)) {
            Alert.alert("Empty Category Name Field", "The category name field must be filled properly.")
            setError("The category name field must be filled properly.")
            return false
        }

        else if (validateEmpty(monthlyLimit)) {
            Alert.alert("Empty Monthly Limit Field", "The monthly limit field must be filled properly.")
            setError("The monthly limit field must be filled properly.")
            return false
        }

        else if (!isNumeric(monthlyLimit)) {
            Alert.alert("Monthly Limit Field Not Numeric", "The monthly limit field must be a number.")
            setError("The monthly limit field must be a number.")
            return false
        }
        
        setError('')
        return true
    }

    const handleAddCategory = () => {
        if (validateForm()) {
            Alert.alert('Success', `Category "${categoryName}" added with a limit of £${monthlyLimit}`)
            setCategoryName('')
            setMonthlyLimit('')
            router.replace("/expenseCategoriesOverview/expenseCategoriesOverviewPage")
            return
        }
    }

    return (
        <View style={styles.container}>
            <TopBar />

            <View style={styles.expenseCategoryForm}>
                <ExpenseCategoryInputs categoryName={categoryName} monthlyLimit={monthlyLimit} setCategoryName={setCategoryName} setMonthlyLimit={setMonthlyLimit} />
            </View>

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
    expenseCategoryForm: {
        marginBottom: 40,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        textAlign: 'center',
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
});