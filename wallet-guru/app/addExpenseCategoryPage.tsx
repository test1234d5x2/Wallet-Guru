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
import ExpenseCategory from '@/models/core/ExpenseCategory';
import getExpenseCategories from '@/utils/apiCalls/getExpenseCategories';
import getCategoryNamesList from '@/utils/getCategoryNamesList';
import Frequency from '@/enums/Frequency';
import isValidFrequency from '@/utils/validation/isValidFrequency';
import isInteger from '@/utils/validation/validateInteger';
import RecurrenceRule from '@/models/recurrenceModels/RecurrenceRule';
import BasicRecurrenceRule from '@/models/recurrenceModels/BasicRecurrenceRule';


async function addExpenseCategory(token: string, name: string, monthlyBudget: number, recurrenceRule: RecurrenceRule) {
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
            monthlyBudget,
            recurrenceRule
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }
}




export default function AddExpenseCategory() {
    setPageTitle("Add Expense Category");

    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [monthlyLimit, setMonthlyLimit] = useState<string>('');
    const [frequency, setFrequency] = useState<Frequency>(Frequency.Daily);
    const [interval, setFrequencyInterval] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [error, setError] = useState<string>('');
    const router = useRouter();


    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to access this page.');
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

    const validateForm = (): boolean => {
        if (!categoryName || !monthlyLimit) {
            setError("Please fill in all the fields.");
            return false;
        }

        if (validateEmpty(categoryName)) {
            setError("The category name field must be filled properly.");
            return false;
        }

        if (validateEmpty(monthlyLimit)) {
            setError("The monthly limit field must be filled properly.");
            return false;
        }

        if (!isNumeric(monthlyLimit)) {
            setError("The monthly limit field must be a number.");
            return false;
        }

        if (getCategoryNamesList(categories).find((cName => cName === categoryName))) {
            setError("This category already exists.");
            return false;
        }


        if (!isValidFrequency(frequency)) {
            setError("Please select a valid frequency.");
            return false;
        }

        if (!isInteger(interval)) {
            setError("Please enter a valid interval.");
            return false;
        }
        else if (parseInt(interval) <= 0) {
            setError("Please enter a valid interval..");
            return false;
        }

        setError('');
        return true;
    };

    const handleAddCategory = () => {
        if (validateForm()) {
            addExpenseCategory(token, categoryName, parseFloat(monthlyLimit), new BasicRecurrenceRule(frequency, parseFloat(interval), startDate as Date)).then((data) => {
                Alert.alert('Success', `Category "${categoryName}" added with a limit of £${monthlyLimit}`);
                clearRouterHistory(router);
                router.replace("/expenseCategoriesOverviewPage");
            }).catch((error: Error) => {
                setError(error.message)
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
                    frequency={frequency}
                    interval={interval}
                    startDate={startDate}
                    setCategoryName={setCategoryName}
                    setMonthlyLimit={setMonthlyLimit}
                    setFrequency={setFrequency}
                    setFrequencyInterval={setFrequencyInterval}
                    setStartDate={setStartDate}
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
