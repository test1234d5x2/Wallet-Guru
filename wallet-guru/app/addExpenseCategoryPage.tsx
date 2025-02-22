import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import ExpenseCategoryInputs from '@/components/formComponents/expenseCategoryInputs';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import validateEmpty from '@/utils/validation/validateEmpty';
import isNumeric from '@/utils/validation/validateNumeric';
import { useRouter } from 'expo-router';
import clearRouterHistory from '@/utils/clearRouterHistory';
import getToken from '@/utils/tokenAccess/getToken';
import ExpenseCategory from '@/models/ExpenseCategory';
import getExpenseCategories from '@/utils/apiCalls/getExpenseCategories';
import getCategoryNamesList from '@/utils/getCategoryNamesList';




async function addExpenseCategory(token: string, name: string, monthlyBudget: number) {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const ADD_EXPENSE_CATEGORY_URL = `http://${API_DOMAIN}/api/expense-categories/`

    const response = await fetch(ADD_EXPENSE_CATEGORY_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            monthlyBudget
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
}




export default function AddExpenseCategory() {
    setPageTitle("Add Expense Category");

    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [monthlyLimit, setMonthlyLimit] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();


    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to view your dashboard.');
            clearRouterHistory(router);
            router.replace("/loginPage");
            return;
        }

        setToken(data.token);
        setEmail(data.email);
    });

    useEffect(() => {
        async function getCategories() {
            const result = await getExpenseCategories(token);
            if (result) {
                setCategories(result);
            } else {
                console.log("Error with getting expense categories list.")
            }
        }

        getCategories();
    }, [token]);

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

        if (getCategoryNamesList(categories).find((cName => cName === categoryName))) {
            Alert.alert("Category Already Exists", "This category already exists.");
            setError("This category already exists.");
            return false;
        }

        setError('');
        return true;
    };

    const handleAddCategory = () => {
        if (validateForm()) {
            addExpenseCategory(token, categoryName, parseFloat(monthlyLimit)).then((data) => {
                Alert.alert('Success', `Category "${categoryName}" added with a limit of £${monthlyLimit}`);
                setCategoryName('');
                setMonthlyLimit('');
                clearRouterHistory(router);
                router.replace("/expenseCategoriesOverviewPage");
            }).catch((error: Error) => {
                Alert.alert("Error Adding Expense Category");
                console.log(error.message)
            })
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

            <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
                <Text style={styles.addButtonText}>Add Category</Text>
            </TouchableOpacity>
        </View>
    );
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
