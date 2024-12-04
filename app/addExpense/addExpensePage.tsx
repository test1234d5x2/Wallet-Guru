import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import ExpenseDetailsInputs from '@/components/formComponents/expenseDetailsInputs';
import setPageTitle from '@/components/pageTitle/setPageTitle';

export default function AddExpense() {

    setPageTitle("Add Expense")

    const [title, setTitle] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [category, setCategory] = useState<string>('Select Category');
    const [notes, setNotes] = useState<string>('');

    const handleAddExpense = () => {
        if (!title || !amount || !date || category === 'Select Category') {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }

        Alert.alert('Success', 'Expense added successfully!');
        return
    }

    const handleScanReceipt = () => {
        Alert.alert('Feature Coming Soon', 'Receipt scanning is not yet implemented.');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.expenseForm}>
                <ExpenseDetailsInputs 
                    title={title}
                    amount={amount}
                    date={date}
                    category={category}
                    notes={notes}
                    categoriesList={["1", "2"]}
                    setTitle={setTitle}
                    setAmount={setAmount}
                    setDate={setDate}
                    setCategory={setCategory}
                    setNotes={setNotes}
                />
            </View>

            <View style={styles.centeredTextContainer}>
                <TouchableOpacity>
                    <Text style={styles.scanText}>Scan Receipt</Text>
                </TouchableOpacity>
            </View>
            

            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Expense</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        display: "flex",
        rowGap: 20,
        padding: 30,
        backgroundColor: '#fff',
        minHeight: Dimensions.get("window").height,
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
    }
})