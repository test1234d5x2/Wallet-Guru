import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import IncomeDetailsInputs from '@/components/formComponents/incomeDetailsInputs';
import validateEmpty from '@/utils/validation/validateEmpty';
import isNumeric from '@/utils/validation/validateNumeric';
import { useRouter } from 'expo-router';
import { isValidDate, isTodayOrBefore } from '@/utils/validation/validateDate';
import clearRouterHistory from '@/utils/clearRouterHistory';
import getToken from '@/utils/tokenAccess/getToken';


async function addIncome(token: string, title: string, amount: number, date: Date, notes: string) {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const ADD_INCOME_URL = `http://${API_DOMAIN}/api/incomes/`

    const response = await fetch(ADD_INCOME_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            amount,
            date,
            notes
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
}



export default function AddIncome() {
    setPageTitle("Add Income");

    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [date, setDate] = useState<Date | null>(null);
    const [notes, setNotes] = useState<string>('');
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

    const validateForm = () => {
        if (!title || !amount || !date) {
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

    const handleAddIncome = () => {
        if (validateForm()) {
            addIncome(token, title, parseFloat(amount), date as Date, notes).then((data) => {
                Alert.alert('Success', 'Income added successfully!');
                clearRouterHistory(router);
                router.replace("/listTransactionsPage");
            }).catch((error: Error) => {
                setError(error.message)
            });

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

            <TouchableOpacity style={styles.addButton} onPress={handleAddIncome}>
                <Text style={styles.addButtonText}>Add Income</Text>
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
