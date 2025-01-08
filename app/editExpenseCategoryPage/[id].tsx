import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ExpenseCategoryInputs from '@/components/formComponents/expenseCategoryInputs';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import validateEmpty from '@/utils/validateEmpty';
import isNumeric from '@/utils/validateNumeric';


export default function EditExpenseCategory() {

    const { id } = useLocalSearchParams();

    setPageTitle("Edit Expense Category")

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

    const handleEditCategory = () => {
        if (validateForm()) {
            Alert.alert('Success', `Category "${categoryName}" added with a limit of £${monthlyLimit}`)
            setCategoryName('')
            setMonthlyLimit('')
            setError("")
            router.replace("/expenseCategoriesOverviewPage")
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

            <TouchableOpacity style={styles.editButton} onPress={handleEditCategory}>
                <Text style={styles.editButtonText}>Edit Category</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
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
})