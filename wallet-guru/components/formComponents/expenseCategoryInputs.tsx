import React from 'react';
import { View, StyleSheet } from 'react-native';
import StandardInputField from './inputFields/standardInputField';
import NumericInputField from './inputFields/numericInputField';
import Frequency from '@/enums/Frequency';
import ModalSelectionRecurrencePeriods from '../modalSelection/modalSelectionRecurrencePeriods';
import DateInputField from './inputFields/dateInputField';
import ModalSelectionColours from '../modalSelection/modalSelectionColours';


interface ExpenseCategoryInputs {
    categoryName: string,
    monthlyLimit: string,
    frequency: Frequency,
    interval: string,
    startDate: Date | null,
    colour: string | null,
    colourChoices: string[],
    setCategoryName: (text: string) => void,
    setMonthlyLimit: (text: string) => void,
    setFrequency: (text: Frequency) => void,
    setFrequencyInterval: (text: string) => void,
    setStartDate: (text: Date) => void,
    setColour: (text: string) => void,
}


export default function ExpenseCategoryInputs(props: ExpenseCategoryInputs) {
    return (
        <View style={styles.container}>

            <StandardInputField
                value={props.categoryName}
                setValue={props.setCategoryName}
                placeholder="Category Name"
                required
            />

            <NumericInputField
                value={props.monthlyLimit}
                placeholder="Monthly Limit"
                setValue={props.setMonthlyLimit}
                required
            />

            <DateInputField date={props.startDate} setDate={props.setStartDate} placeholder={'Start Date'} required />

            <ModalSelectionRecurrencePeriods choices={Object.keys(Frequency) as Frequency[]} value={props.frequency} setValue={props.setFrequency} required />

            <NumericInputField placeholder='Interval' value={props.interval} setValue={props.setFrequencyInterval} required />

            <ModalSelectionColours choices={props.colourChoices} value={props.colour} setValue={props.setColour} />

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