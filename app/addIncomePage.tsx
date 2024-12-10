import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import IncomeDetailsInputs from '@/components/formComponents/incomeDetailsInputs';
import validateEmpty from '@/utils/validateEmpty';
import isNumeric from '@/utils/validateNumeric';
import { useRouter } from 'expo-router';



export default function AddIncome() {

    setPageTitle("Add Income")

    const [title, setTitle] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [notes, setNotes] = useState<string>('')
    const [error, setError] = useState<string>('')
    const router = useRouter()

    const handleAddIncome = () => {
        if (!title || !amount || !date) {
            Alert.alert('Please fill in all required fields.')
            setError("Fill in all the required fields.")
            return;
        }

        else if (validateEmpty(title)) {
            Alert.alert("Empty Title Field", "The title field must be filled properly.")
            setError("The title field must be filled properly.")
            return
        }

        else if (validateEmpty(amount)) {
            Alert.alert("Empty Amount Field", "The amount field must be filled properly.")
            setError("The amount field must be filled properly.")
            return
        }

        else if (!isNumeric(amount)) {
            Alert.alert("Amount Field Not Numeric", "The amount field must be a number.")
            setError("The amount field must be a number.")
            return
        }

        // Date field needs to be changed to a date picker.

        Alert.alert('Success', 'Income added successfully!')
        setError("")

        router.replace("/listTransactionsPage")

        return
    }

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
    )
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
})