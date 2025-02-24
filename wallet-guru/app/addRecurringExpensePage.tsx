import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import validateEmpty from '@/utils/validation/validateEmpty';
import isNumeric from '@/utils/validation/validateNumeric';
import { useRouter } from 'expo-router';
import { isValidDate } from '@/utils/validation/validateDate';
import ExpenseCategory from '@/models/core/ExpenseCategory';
import clearRouterHistory from '@/utils/clearRouterHistory';
import getToken from '@/utils/tokenAccess/getToken';
import getExpenseCategories from '@/utils/apiCalls/getExpenseCategories';
import Frequency from '@/enums/Frequency';
import RecurrentExpenseDetailsInputs from '@/components/formComponents/recurrentExpenseInputs';
import isInteger from '@/utils/validation/validateInteger';
import isValidFrequency from '@/utils/validation/isValidFrequency';
import RecurrenceRule from '@/models/recurrenceModels/RecurrenceRule';
import BasicRecurrenceRule from '@/models/recurrenceModels/BasicRecurrenceRule';


async function addRecurrentExpense(token: string, title: string, amount: number, date: Date, categoryID: string, notes: string, recurrenceRule: RecurrenceRule) {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const ADD_RECURRING_EXPENSE_URL = `http://${API_DOMAIN}/api/recurring-expenses/`;

    const response = await fetch(ADD_RECURRING_EXPENSE_URL, {
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
            categoryID,
            recurrenceRule
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    };
}



export default function AddRecurrentExpense() {
    setPageTitle("Add Recurrent Expense");

    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [title, setTitle] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [category, setCategory] = useState<ExpenseCategory | null>(null);
    const [frequency, setFrequency] = useState<Frequency>(Frequency.Daily);
    const [interval, setFrequencyInterval] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [notes, setNotes] = useState<string>('');
    const [error, setError] = useState<string>('');

    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to add a recurrent expense.');
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
        if (!title || !amount || !startDate || !category || !frequency || !interval) {
            Alert.alert('Please fill in all required fields.');
            setError("Fill in all the required fields.");
            return false;
        }

        if (validateEmpty(title.trim())) {
            Alert.alert("Empty Title Field", "The title field must be filled properly.");
            setError("The title field must be filled properly.");
            return false;
        }

        if (validateEmpty(amount)) {
            Alert.alert("Empty Amount Field", "The amount field must be filled properly.");
            setError("The amount field must be filled properly.");
            return false;
        }
        else if (!isNumeric(amount)) {
            Alert.alert("Amount Field Not Numeric", "The amount field must be a number greater than 0.");
            setError("The amount field must be a number greater than 0.");
            return false;
        }
        else if (parseFloat(amount) <= 0) {
            Alert.alert("Amount Field Not Numeric", "The amount field must be a number greater than 0.");
            setError("The amount field must be a number greater than 0.");
            return false;
        }


        if (!isValidDate(startDate)) {
            Alert.alert("Start Date Field Invalid", "Please select a date.");
            setError("Please select a valid date.");
            return false;
        }

        if (endDate && !isValidDate(endDate)) {
            Alert.alert("End Date Field Invalid", "Please select a date.");
            setError("Please select a valid date.");
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

        if (endDate && endDate <= startDate) {
            Alert.alert("Invalid End Date", "End date must be after the start date.");
            setError("End date must be after the start date.");
            return false;
        }

        setError("");
        return true;
    };

    const handleAddRecurrentExpense = () => {
        if (validateForm()) {
            const recurrenceRule = new BasicRecurrenceRule(frequency, parseFloat(interval), startDate as Date, undefined, endDate as Date)
            addRecurrentExpense(token, title, parseFloat(amount), new Date(), (category as ExpenseCategory).getID(), notes, recurrenceRule).then((data) => {
                Alert.alert('Success', 'Recurrent expense added successfully!');
                clearRouterHistory(router);
                router.replace("/listRecurringTransactionsPage");
            }).catch((error: Error) => {
                Alert.alert("Error Adding Reccurent Expense");
                console.log(error)
            })
        };
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TopBar />

            <View style={styles.expenseForm}>
                <RecurrentExpenseDetailsInputs
                    title={title}
                    amount={amount}
                    category={category}
                    notes={notes}
                    frequency={frequency}
                    interval={interval}
                    startDate={startDate}
                    endDate={endDate}
                    categoriesList={categories}
                    setTitle={setTitle}
                    setAmount={setAmount}
                    setCategory={setCategory}
                    setNotes={setNotes}
                    setFrequency={setFrequency}
                    setFrequencyInterval={setFrequencyInterval}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
            </View>

            {error ? <View style={styles.centeredTextContainer}><Text style={styles.errorText}>{error}</Text></View> : null}

            <TouchableOpacity style={styles.addButton} onPress={handleAddRecurrentExpense}>
                <Text style={styles.addButtonText}>Add Recurrent Expense</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        rowGap: 20,
        padding: 20,
        paddingBottom: 40,
        backgroundColor: '#fff',
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
