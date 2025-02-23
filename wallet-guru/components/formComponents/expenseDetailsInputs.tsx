import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import StandardInputField from './inputFields/standardInputField';
import NumericInputField from './inputFields/numericInputField';
import DateInputField from './inputFields/dateInputField';
import ExpenseCategory from '@/models/core/ExpenseCategory';
import ModalSelectionExpenseCategories from '../modalSelection/modalSelectionExpenseCategories';


interface ExpenseDetailsInputsProps {
    title: string,
    amount: string,
    date: Date | null,
    category: ExpenseCategory | null,
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

            <ModalSelectionExpenseCategories choices={props.categoriesList} value={props.category} setValue={props.setCategory} />

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