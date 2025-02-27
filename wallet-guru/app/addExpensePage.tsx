import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Image, Dimensions } from 'react-native';
import ExpenseDetailsInputs from '@/components/formComponents/expenseDetailsInputs';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import validateEmpty from '@/utils/validation/validateEmpty';
import isNumeric from '@/utils/validation/validateNumeric';
import { useRouter } from 'expo-router';
import { isTodayOrBefore, isValidDate } from '@/utils/validation/validateDate';
import ExpenseCategory from '@/models/core/ExpenseCategory';
import clearRouterHistory from '@/utils/clearRouterHistory';
import getToken from '@/utils/tokenAccess/getToken';
import getExpenseCategories from '@/utils/apiCalls/getExpenseCategories';
import pickImage from '@/utils/pickImage';
import updateCategoriesTimeWindowEnd from '@/utils/analytics/batchProcessRecurrencesUpdates/updateCategoriesTimeWindowEnd';


async function addExpense(token: string, title: string, amount: number, date: Date, expenseCategoryID: string, notes: string, receipt?: string) {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const ADD_EXPENSE_URL = `http://${API_DOMAIN}/api/expenses/`;

    const response = await fetch(ADD_EXPENSE_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            amount,
            date,
            notes,
            expenseCategoryID,
            receipt: receipt === undefined ? '' : receipt
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    };
}



export default function AddExpense() {
    setPageTitle("Add Expense");

    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [title, setTitle] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [date, setDate] = useState<Date | null>(null);
    const [category, setCategory] = useState<ExpenseCategory | null>(null);
    const [notes, setNotes] = useState<string>('');
    const [receipt, setReceipt] = useState<string>('');
    const [error, setError] = useState<string>('');

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
                await updateCategoriesTimeWindowEnd(result, token);
            } else {
                console.log("Error with getting expense categories list.")
            }
        }

        getCategories();
    }, [token]);


    const validateForm = () => {
        if (!title || !amount || !date || !category) {
            setError("Fill in all the required fields.");
            return false;
        }

        if (validateEmpty(title)) {
            setError("The title field must be filled properly.");
            return false;
        }

        if (validateEmpty(amount)) {
            setError("The amount field must be filled properly.");
            return false;
        }

        if (!isNumeric(amount)) {
            setError("The amount field must be a number.");
            return false;
        }

        if (!isValidDate(date)) {
            setError("Please select a date.");
            return false;
        }

        if (!isTodayOrBefore(date)) {
            setError("Please select a date that is today or before today.");
            return false;
        }

        setError("");
        return true;
    };

    const handleAddExpense = () => {
        if (validateForm() && category) {
            addExpense(token, title, parseFloat(amount), date as Date, category.getID(), notes, receipt).then((data) => {
                Alert.alert('Success', 'Expense added successfully!');
                clearRouterHistory(router);
                router.replace("/listTransactionsPage");
            }).catch((error: Error) => {
                setError(error.message)
            })
        };
    };

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

            {receipt ? <View style={styles.centeredTextContainer}><Text>Receipt Set</Text></View>: ""}

            {error ? <View style={styles.centeredTextContainer}><Text style={styles.errorText}>{error}</Text></View> : null}

            <View style={styles.centeredTextContainer}>
                <TouchableOpacity onPress={() => pickImage(setReceipt)}>
                    <Text style={styles.scanText}>Upload Receipt</Text>
                </TouchableOpacity>
                
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
                <Text style={styles.addButtonText}>Add Expense</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        rowGap: 20,
        padding: 20,
        backgroundColor: '#fff',
        minHeight: "100%",
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
});
