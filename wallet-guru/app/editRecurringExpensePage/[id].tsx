import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import validateEmpty from '@/utils/validation/validateEmpty';
import isNumeric from '@/utils/validation/validateNumeric';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { isValidDate } from '@/utils/validation/validateDate';
import ExpenseCategory from '@/models/core/ExpenseCategory';
import clearRouterHistory from '@/utils/clearRouterHistory';
import getToken from '@/utils/tokenAccess/getToken';
import getExpenseCategories from '@/utils/apiCalls/getExpenseCategories';
import Frequency from '@/enums/Frequency';
import RecurrentExpenseDetailsInputs from '@/components/formComponents/recurrentExpenseInputs';
import isInteger from '@/utils/validation/validateInteger';
import isValidFrequency from '@/utils/validation/isValidFrequency';
import getRecurringExpenseByID from '@/utils/apiCalls/getRecurringExpenseByID';
import BasicRecurrenceRule from '@/models/recurrenceModels/BasicRecurrenceRule';
import updateRecurrentExpense from '@/utils/apiCalls/updateReccuringExpense';
import updateCategoriesTimeWindowEnd from '@/utils/analytics/batchProcessRecurrencesUpdates/updateCategoriesTimeWindowEnd';


export default function EditRecurrentExpense() {
    setPageTitle("Edit Recurrent Expense");

    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [title, setTitle] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [category, setCategory] = useState<ExpenseCategory>();
    const [frequency, setFrequency] = useState<Frequency>(Frequency.Daily);
    const [interval, setFrequencyInterval] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [notes, setNotes] = useState<string>('');
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


    useEffect(() => {
        async function getRecurringExpense() {
            getRecurringExpenseByID(token, id as string).then((data) => {
                setTitle(data.title);
                setAmount(data.amount.toString());
                setFrequency(data.recurrenceRule.frequency);
                setFrequencyInterval(data.recurrenceRule.interval.toString());
                setStartDate(data.recurrenceRule.startDate);
                setEndDate(data.recurrenceRule.endDate || null);

                if (categories) setCategory(categories.find((cat) => cat.getID() === data.categoryID));
            }).catch((err: Error) => {
                Alert.alert("Recurrent Expense Not Found")
                console.log(err.message);
                clearRouterHistory(router);
                router.replace("/listRecurringTransactionsPage");
            })
        }

        if (token && categories) {
            getRecurringExpense()
        }
    }, [token, categories])


    const validateForm = (): boolean => {
        if (!title || !amount || !startDate || !category || !frequency || !interval) {
            setError("Fill in all the required fields.");
            return false;
        }

        if (validateEmpty(title.trim())) {
            setError("The title field must be filled properly.");
            return false;
        }

        if (validateEmpty(amount)) {
            setError("The amount field must be filled properly.");
            return false;
        }
        else if (!isNumeric(amount)) {
            setError("The amount field must be a number greater than 0.");
            return false;
        }
        else if (parseFloat(amount) <= 0) {
            setError("The amount field must be a number greater than 0.");
            return false;
        }


        if (!isValidDate(startDate)) {
            setError("Please select a valid date.");
            return false;
        }

        if (endDate && !isValidDate(endDate)) {
            setError("Please select a valid date.");
            return false;
        }

        if (!isValidFrequency(frequency)) {
            setError("Please select a valid frequency.");
            return false;
        }

        if (!isInteger(interval)) {
            setError("Please select a date.");
            return false;
        }
        else if (parseInt(interval) <= 0) {
            setError("Please select a date.");
            return false;
        }

        if (endDate && endDate <= startDate) {
            setError("End date must be after the start date.");
            return false;
        }

        setError("");
        return true;
    };

    const handleEditRecurrentExpense = () => {
        if (validateForm()) {
            const recurrenceRule = new BasicRecurrenceRule(frequency, parseFloat(interval), startDate as Date, undefined, endDate as Date);
            updateRecurrentExpense(token, id as string, title, parseFloat(amount), new Date(), (category as ExpenseCategory).getID(), notes, recurrenceRule).then((data) => {
                Alert.alert('Success', 'Recurrent Expense updated successfully!');
                clearRouterHistory(router);
                router.replace(`/viewRecurringExpenseDetailsPage/${id}`);
            }).catch((error: Error) => {
                setError(error.message)
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
                    category={category === undefined ? null : category}
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

            <TouchableOpacity style={styles.editButton} onPress={handleEditRecurrentExpense}>
                <Text style={styles.editButtonText}>Edit Recurrent Expense</Text>
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
    centeredTextContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: 'red',
        fontSize: 14,
    },
});
