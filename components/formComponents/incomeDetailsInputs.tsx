import React from 'react';
import { TextInput, StyleSheet, ScrollView } from 'react-native';


interface IncomeDetailsInputsProps {
    title: string,
    amount: string,
    date: string,
    notes: string,
    setTitle: (text: string) => void,
    setAmount: (text: string) => void,
    setDate: (text: string) => void,
    setNotes: (text: string) => void,
}


export default function IncomeDetailsInputs(props: IncomeDetailsInputsProps) {

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor={"rgba(0,0,0,0.25)"}
                value={props.title}
                onChangeText={props.setTitle}
            />

            <TextInput
                style={styles.input}
                placeholder="Amount"
                placeholderTextColor={"rgba(0,0,0,0.25)"}
                keyboardType="numeric"
                value={props.amount}
                onChangeText={props.setAmount}
            />

            <TextInput
                style={styles.input}
                placeholder="Date"
                placeholderTextColor={"rgba(0,0,0,0.25)"}
                value={props.date}
                onChangeText={props.setDate}
            />

            <TextInput
                style={styles.input}
                placeholder="Notes"
                placeholderTextColor={"rgba(0,0,0,0.25)"}
                value={props.notes}
                onChangeText={props.setNotes}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        rowGap: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        fontSize: 16,
    },
});