import React from 'react'
import { StyleSheet, View } from 'react-native'
import StandardInputField from './inputFields/standardInputField'
import NumericInputField from './inputFields/numericInputField'
import DateInputField from './inputFields/dateInputField'
import ModalSelectionRecurrencePeriods from '../modalSelection/modalSelectionRecurrencePeriods'
import Frequency from '@/enums/Frequency'
import IncomeCategory from '@/models/core/IncomeCategory'
import { ModalSelectionIncomeCategories } from '../modalSelection/modalSelectionCategories'


interface RecurrentIncomeDetailsInputsProps {
    title: string,
    amount: string,
    notes: string,
    category: IncomeCategory | null,
    frequency: Frequency,
    interval: string,
    startDate: Date | null,
    endDate: Date | null,
    setTitle: (text: string) => void,
    setAmount: (text: string) => void,
    setNotes: (text: string) => void,
    setCategory: (text: IncomeCategory) => void,
    setFrequency: (text: Frequency) => void,
    setFrequencyInterval: (text: string) => void,
    setStartDate: (text: Date) => void,
    setEndDate: (text: Date) => void,
    categoriesList: Array<IncomeCategory>,
}


export default function RecurrentIncomeDetailsInputs(props: RecurrentIncomeDetailsInputsProps) {
    return (
        <View style={styles.container}>

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

            <ModalSelectionIncomeCategories choices={props.categoriesList} value={props.category} setValue={props.setCategory} required />

            <DateInputField date={props.startDate} setDate={props.setStartDate} placeholder={'Start Date'} required />

            <DateInputField date={props.endDate} setDate={props.setEndDate} placeholder={'End Date'} />

            <ModalSelectionRecurrencePeriods choices={Object.keys(Frequency) as Frequency[]} value={props.frequency} setValue={props.setFrequency} required />

            <NumericInputField placeholder='Interval' value={props.interval} setValue={props.setFrequencyInterval} required />

            <StandardInputField
                placeholder="Notes"
                value={props.notes}
                setValue={props.setNotes}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        rowGap: 20,
    },
})