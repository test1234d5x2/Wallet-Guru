import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import StandardInputField from './inputFields/standardInputField';
import NumericInputField from './inputFields/numericInputField';
import DateInputField from './inputFields/dateInputField';


interface IncomeDetailsInputsProps {
    title: string,
    amount: string,
    date: Date | null,
    notes: string,
    setTitle: (text: string) => void,
    setAmount: (text: string) => void,
    setDate: (text: Date) => void,
    setNotes: (text: string) => void,
}


export default function IncomeDetailsInputs(props: IncomeDetailsInputsProps) {
    return (
        <ScrollView contentContainerStyle={styles.container}>

            <StandardInputField
                placeholder="Title"
                value={props.title}
                setValue={props.setTitle}
            />

            <NumericInputField
                placeholder="Amount"
                value={props.amount}
                setValue={props.setAmount}
            />

            <DateInputField date={props.date} setDate={props.setDate} />

            <StandardInputField
                placeholder="Notes"
                value={props.notes}
                setValue={props.setNotes}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        rowGap: 20,
    },
});