import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import StandardInputField from './inputFields/standardInputField';
import NumericInputField from './inputFields/numericInputField';
import ModalSelection from '../modalSelection/modalSelectionExpenseCategories';
import DateInputField from './inputFields/dateInputField';
import ExpenseCategory from '@/models/ExpenseCategory';


interface ExpenseDetailsInputsProps {
    title: string,
    amount: string,
    date: Date,
    category: ExpenseCategory,
    notes: string,
    categoriesList: Array<ExpenseCategory>,
    setTitle: (text: string) => void,
    setAmount: (text: string) => void,
    setDate: (text: Date) => void,
    setCategory: (text: ExpenseCategory) => void,
    setNotes: (text: string) => void,
}


export default function ExpenseDetailsInputs(props: ExpenseDetailsInputsProps) {
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

            <ModalSelection choices={props.categoriesList} value={props.category} setValue={props.setCategory} />

            <StandardInputField
                placeholder="Notes"
                value={props.notes}
                setValue={props.setNotes}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        rowGap: 20,
    },
})