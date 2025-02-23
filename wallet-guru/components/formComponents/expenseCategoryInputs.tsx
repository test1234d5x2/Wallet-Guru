import React from 'react';
import { View, StyleSheet } from 'react-native';
import StandardInputField from './inputFields/standardInputField';
import NumericInputField from './inputFields/numericInputField';
import Frequency from '@/enums/Frequency';
import ModalSelectionRecurrencePeriods from '../modalSelection/modalSelectionRecurrencePeriods';
import DateInputField from './inputFields/dateInputField';

interface ExpenseCategoryInputs {
    categoryName: string,
    monthlyLimit: string,
    frequency: Frequency,
    interval: string,
    startDate: Date | null,
    setCategoryName: (text: string) => void,
    setMonthlyLimit: (text: string) => void,
    setFrequency: (text: Frequency) => void,
    setFrequencyInterval: (text: string) => void,
    setStartDate: (text: Date) => void,
}


export default function ExpenseCategoryInputs(props: ExpenseCategoryInputs) {
    return (
        <View style={styles.container}>

            <StandardInputField
                value={props.categoryName}
                setValue={props.setCategoryName}
                placeholder="Category Name"
            />

            <NumericInputField
                value={props.monthlyLimit}
                placeholder="Monthly Limit"
                setValue={props.setMonthlyLimit}
            />

            <DateInputField date={props.startDate} setDate={props.setStartDate} placeholder={'Start Date'} />

            <ModalSelectionRecurrencePeriods choices={Object.keys(Frequency) as Frequency[]} value={props.frequency} setValue={props.setFrequency} />

            <NumericInputField placeholder='Interval' value={props.interval} setValue={props.setFrequencyInterval} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        rowGap: 20,
    },
});