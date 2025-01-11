import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ExpenseCategoryInputs from '@/components/formComponents/expenseCategoryInputs';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import validateEmpty from '@/utils/validateEmpty';
import isNumeric from '@/utils/validateNumeric';
import clearRouterHistory from '@/utils/clearRouterHistory';
import Registry from '@/models/data/Registry';

export default function EditExpenseCategory() {
    const { id } = useLocalSearchParams();

    setPageTitle("Edit Expense Category");

    const registry = Registry.getInstance();
    const authService = registry.authService;
    const expenseCategoryService = registry.expenseCategoryService;

    const authenticatedUser = authService.getAuthenticatedUser();
    const router = useRouter();

    if (!authenticatedUser) {
        Alert.alert("Error", "You must be logged in to edit a category.");
        clearRouterHistory(router);
        router.replace("/loginPage");
        return;
    }

    const category = expenseCategoryService
        .getAllCategoriesByUser(authenticatedUser)
        .find(cat => cat.getID() === id);

    if (!category) {
        Alert.alert("Error", "Category not found.");
        clearRouterHistory(router);
        router.replace("/expenseCategoriesOverviewPage");
        return;
    }

    const [categoryName, setCategoryName] = useState<string>(category.name);
    const [monthlyLimit, setMonthlyLimit] = useState<string>(category.monthlyBudget.toString());
    const [error, setError] = useState<string>('');

    const validateForm = () => {
        if (!categoryName || !monthlyLimit) {
            Alert.alert("Please fill in all the fields.");
            setError("Please fill in all the fields.");
            return false;
        }

        if (validateEmpty(categoryName)) {
            Alert.alert("Empty Category Name Field", "The category name field must be filled properly.");
            setError("The category name field must be filled properly.");
            return false;
        }

        if (validateEmpty(monthlyLimit)) {
            Alert.alert("Empty Monthly Limit Field", "The monthly limit field must be filled properly.");
            setError("The monthly limit field must be filled properly.");
            return false;
        }

        if (!isNumeric(monthlyLimit)) {
            Alert.alert("Monthly Limit Field Not Numeric", "The monthly limit field must be a number.");
            setError("The monthly limit field must be a number.");
            return false;
        }

        setError('');
        return true;
    };

    const handleEditCategory = () => {
        if (validateForm()) {
            try {
                expenseCategoryService.updateExpenseCategory(
                    id as string,
                    categoryName,
                    parseFloat(monthlyLimit)
                );
                Alert.alert('Success', `Category "${categoryName}" updated with a limit of £${monthlyLimit}`);
                clearRouterHistory(router);
                router.replace("/expenseCategoriesOverviewPage");
            } catch (err: any) {
                Alert.alert("Error", err.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <TopBar />

            <View style={styles.expenseCategoryForm}>
                <ExpenseCategoryInputs
                    categoryName={categoryName}
                    monthlyLimit={monthlyLimit}
                    setCategoryName={setCategoryName}
                    setMonthlyLimit={setMonthlyLimit}
                />
            </View>

            {error === '' ? null : <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.editButton} onPress={handleEditCategory}>
                <Text style={styles.editButtonText}>Edit Category</Text>
            </TouchableOpacity>
        </View>
    );
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
});
