import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ExpenseCategoryInputs from '@/components/formComponents/expenseCategoryInputs';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import validateEmpty from '@/utils/validation/validateEmpty';
import isNumeric from '@/utils/validation/validateNumeric';
import clearRouterHistory from '@/utils/clearRouterHistory';
import getToken from '@/utils/tokenAccess/getToken';
import getExpenseCategoryByID from '@/utils/apiCalls/getExpenseCategoryByID';
import updateExpenseCategory from '@/utils/apiCalls/updateExpenseCategory';
import ExpenseCategory from '@/models/core/ExpenseCategory';
import getExpenseCategories from '@/utils/apiCalls/getExpenseCategories';
import Frequency from '@/enums/Frequency';
import isValidFrequency from '@/utils/validation/isValidFrequency';
import isInteger from '@/utils/validation/validateInteger';
import BasicRecurrenceRule from '@/models/recurrenceModels/BasicRecurrenceRule';


export default function EditExpenseCategory() {
    setPageTitle("Edit Expense Category");

    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [monthlyLimit, setMonthlyLimit] = useState<string>('');
    const [frequency, setFrequency] = useState<Frequency>(Frequency.Daily);
    const [interval, setFrequencyInterval] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [error, setError] = useState<string>('');

    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to edit an expense category.');
            clearRouterHistory(router);
            router.replace("/loginPage");
            return;
        }

        setToken(data.token);
        setEmail(data.email);
    });


    useEffect(() => {
        async function getExpenseCategory() {
            getExpenseCategoryByID(token, id as string).then((category) => {
                setCategoryName(category.name);
                setMonthlyLimit(category.monthlyBudget.toString());
                setFrequency(category.recurrenceRule.frequency);
                setFrequencyInterval(category.recurrenceRule.interval.toString());
                setStartDate(category.recurrenceRule.startDate);
            }).catch((error: Error) => {
                Alert.alert("Expense Category Not Found")
                console.log(error.message);
                clearRouterHistory(router);
                router.replace("/expenseCategoriesOverviewPage");
            })
        }

        if (token) getExpenseCategory();
    }, [token]);


    useEffect(() => {
        async function getCategories() {
            const result = await getExpenseCategories(token);
            if (result) {
                setCategories(result);
            } else {
                console.log("Error with getting expense categories list.")
            }
        }

        if (token) {
            getCategories();

        }
    }, [token]);

    const validateForm = (): boolean => {
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

        if (categories.find((cat => cat.name === categoryName && cat.getID() !== id))) {
            Alert.alert("Category Already Exists", "This category already exists.");
            setError("This category already exists.");
            return false;
        }


        if (!isValidFrequency(frequency)) {
            Alert.alert("Frequency Field Invalid", "Please select a valid frequency.");
            setError("Please select a valid frequency.");
            return false;
        }

        if (!isInteger(interval)) {
            Alert.alert("Interval Field Invalid", "Interval must be a whole number greater than 0.");
            setError("Please select a date.");
            return false;
        }
        else if (parseInt(interval) <= 0) {
            Alert.alert("Interval Field Invalid", "Interval must be a whole number greater than 0.");
            setError("Please select a date.");
            return false;
        }

        setError('');
        return true;
    };

    const handleEditCategory = () => {
        if (validateForm()) {
            const recurrenceRule = new BasicRecurrenceRule(frequency, parseFloat(interval), startDate as Date);
            updateExpenseCategory(token, id as string, categoryName, parseFloat(monthlyLimit), recurrenceRule).then((complete) => {
                if (complete) {
                    Alert.alert('Success', `Category "${categoryName}" updated with a limit of £${monthlyLimit}`);
                    clearRouterHistory(router);
                    router.replace("/expenseCategoriesOverviewPage");
                }
            }).catch((error: Error) => {
                Alert.alert("Failed", "Expense cateogry failed to update.");
                console.log(error.message);
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
