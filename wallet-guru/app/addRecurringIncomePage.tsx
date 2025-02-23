import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import validateEmpty from '@/utils/validation/validateEmpty';
import isNumeric from '@/utils/validation/validateNumeric';
import { useRouter } from 'expo-router';
import { isValidDate, isTodayOrBefore } from '@/utils/validation/validateDate';
import clearRouterHistory from '@/utils/clearRouterHistory';
import getToken from '@/utils/tokenAccess/getToken';
import Frequency from '@/enums/Frequency';
import RecurrentIncomeDetailsInputs from '@/components/formComponents/recurrentIncomeInputs';
import isInteger from '@/utils/validation/validateInteger';
import isValidFrequency from '@/utils/validation/isValidFrequency';


async function addRecurrentIncome(token: string) {
    // const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    // if (!API_DOMAIN) {
    //     throw new Error("Domain could not be found.");
    // };

    // const ADD_INCOME_URL = `http://${API_DOMAIN}/api/incomes/`

    // const response = await fetch(ADD_INCOME_URL, {
    //     method: "POST",
    //     headers: {
    //         "Authorization": `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //         title,
    //         amount,
    //         date,
    //         notes
    //     })
    // });

    // if (!response.ok) {
    //     const error = await response.json();
    //     throw new Error(error.message);
    // }
}



export default function AddRecurrentIncome() {
    setPageTitle("Add Recurrent Income");

    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [frequency, setFrequency] = useState<Frequency>(Frequency.Daily);
    const [interval, setFrequencyInterval] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [notes, setNotes] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();


    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to add a recurrent income.');
            clearRouterHistory(router);
            router.replace("/loginPage");
            return;
        }

        setToken(data.token);
        setEmail(data.email);
    });

    const validateForm = (): boolean => {
        if (!title || !amount || !startDate || !frequency || !interval) {
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

    const handleAddRecurrentIncome = () => {
        if (validateForm()) {
            console.log("Form Valid");
            // addIncome(token, title, parseFloat(amount), date as Date, notes).then((data) => {
            //     Alert.alert('Success', 'Income added successfully!');
            //     setTitle('');
            //     setAmount('');
            //     setDate(null);
            //     setNotes('');
            //     clearRouterHistory(router);
            //     router.replace("/listTransactionsPage");
            // }).catch((error: Error) => {
            //     Alert.alert("Error Adding Income");
            //     console.log(error.message)
            // });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TopBar />

            <View style={styles.incomeForm}>
                <RecurrentIncomeDetailsInputs
                    title={title}
                    amount={amount}
                    notes={notes}
                    frequency={frequency}
                    interval={interval}
                    startDate={startDate}
                    endDate={endDate}
                    setTitle={setTitle}
                    setAmount={setAmount}
                    setNotes={setNotes}
                    setFrequency={setFrequency}
                    setFrequencyInterval={setFrequencyInterval}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
            </View>

            {error ? <View style={styles.centeredTextContainer}><Text style={styles.errorText}>{error}</Text></View> : null}

            <TouchableOpacity style={styles.addButton} onPress={handleAddRecurrentIncome}>
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
