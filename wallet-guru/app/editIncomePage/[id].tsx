import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import IncomeDetailsInputs from '@/components/formComponents/incomeDetailsInputs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import validateEmpty from '@/utils/validation/validateEmpty';
import isNumeric from '@/utils/validation/validateNumeric';
import { isValidDate, isTodayOrBefore } from '@/utils/validation/validateDate';
import clearRouterHistory from '@/utils/clearRouterHistory';
import getToken from '@/utils/tokenAccess/getToken';
import getIncomeByID from '@/utils/apiCalls/getIncomeByID';
import updateIncome from '@/utils/apiCalls/updateIncome';

export default function EditIncome() {
    setPageTitle("Edit Income");

    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());
    const [notes, setNotes] = useState<string>('');
    const [error, setError] = useState<string>('');


    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to edit income.');
            clearRouterHistory(router);
            router.replace("/loginPage");
            return;
        }

        setToken(data.token);
        setEmail(data.email);
    });

    useEffect(() => {
        async function getIncome() {
            getIncomeByID(token, id as string).then((income) => {
                setTitle(income.title);
                setAmount(income.amount.toString());
                setDate(income.date);
                setNotes(income.notes);
            }).catch((error: Error) => {
                Alert.alert("Income Not Found")
                console.log(error.message);
                clearRouterHistory(router);
                router.replace("/listTransactionsPage");
            })
        }

        if (token) getIncome();
    }, [token]);

    const validateForm = () => {
        if (!title || !amount || !date) {
            Alert.alert('Please fill in all required fields.');
            setError("Fill in all the required fields.");
            return false;
        }

        if (validateEmpty(title)) {
            Alert.alert("Empty Title Field", "The title field must be filled properly.");
            setError("The title field must be filled properly.");
            return false;
        }

        if (validateEmpty(amount)) {
            Alert.alert("Empty Amount Field", "The amount field must be filled properly.");
            setError("The amount field must be filled properly.");
            return false;
        }

        if (!isNumeric(amount)) {
            Alert.alert("Amount Field Not Numeric", "The amount field must be a number.");
            setError("The amount field must be a number.");
            return false;
        }

        if (!isValidDate(date)) {
            Alert.alert("Date Field Invalid", "Please select a date.");
            setError("Please select a date.");
            return false;
        }

        if (!isTodayOrBefore(date)) {
            Alert.alert("Date Field Invalid", "Please select a date that is today or before today.");
            setError("Please select a date that is today or before today.");
            return false;
        }

        setError("");
        return true;
    };

    const handleEditIncome = () => {
        if (validateForm()) {
            updateIncome(token, id as string, title, parseFloat(amount), date, notes).then((complete) => {
                if (complete) {
                    Alert.alert('Success', 'Income updated successfully!');
                    clearRouterHistory(router);
                    router.replace("/listTransactionsPage");
                }
            }).catch((error: Error) => {
                Alert.alert("Error", "Failed to update income.");
                console.log(error.message);
            })
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TopBar />

            <View style={styles.incomeForm}>
                <IncomeDetailsInputs
                    title={title}
                    amount={amount}
                    date={date}
                    notes={notes}
                    setTitle={setTitle}
                    setAmount={setAmount}
                    setDate={setDate}
                    setNotes={setNotes}
                />
            </View>

            {error ? <View style={styles.centeredTextContainer}><Text style={styles.errorText}>{error}</Text></View> : null}

            <TouchableOpacity style={styles.addButton} onPress={handleEditIncome}>
                <Text style={styles.addButtonText}>Edit Income</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        rowGap: 20,
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
    },
    incomeForm: {
        marginBottom: 40,
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
