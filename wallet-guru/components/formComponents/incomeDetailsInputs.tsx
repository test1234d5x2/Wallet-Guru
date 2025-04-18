import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import StandardInputField from './inputFields/standardInputField'
import NumericInputField from './inputFields/numericInputField'
import DateInputField from './inputFields/dateInputField'
import IncomeCategory from '@/models/core/IncomeCategory'
import { ModalSelectionIncomeCategories } from '../modalSelection/modalSelectionCategories'


interface IncomeDetailsInputsProps {
    title: string,
    amount: string,
    date: Date | null,
    category: IncomeCategory | null,
    notes: string,
    categoriesList: Array<IncomeCategory>,
    setTitle: (text: string) => void,
    setAmount: (text: string) => void,
    setDate: (text: Date) => void,
    setCategory: (text: IncomeCategory) => void,
    setNotes: (text: string) => void,
}


export default function IncomeDetailsInputs(props: IncomeDetailsInputsProps) {
    return (
        <ScrollView contentContainerStyle={styles.container}>

            <StandardInputField
                placeholder="Title"
                value={props.title}
                setValue={props.setTitle}
                required
            />

            <NumericInputField
                placeholder="Amount"
                value={props.amount}
                setValue={props.setAmount}
                required
            />

            <DateInputField date={props.date} setDate={props.setDate} required />

            <ModalSelectionIncomeCategories choices={props.categoriesList} value={props.category} setValue={props.setCategory} required />

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
})