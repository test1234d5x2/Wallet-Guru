import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import IncomeDetailsInputs from '@/components/formComponents/incomeDetailsInputs';


export default function EditIncome() {

    setPageTitle("Edit Income")

    const [title, setTitle] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [error, setError] = useState<string>('')

    const handleEditIncome = () => {
        if (!title || !amount || !date) {
            Alert.alert('Error', 'Please fill in all required fields.');
            setError("Fill in all the required fields.")
            return;
        }

        Alert.alert('Success', 'Expense added successfully!');
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
            

            <TouchableOpacity style={styles.addButton} onPress={handleEditIncome}>
                <Text style={styles.addButtonText}>Edit Income</Text>
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
        minHeight: Dimensions.get("window").height,
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