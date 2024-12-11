import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import StandardInputField from './inputFields/standardInputField';
import NumericInputField from './inputFields/numericInputField';
import ModalSelection from '../modalSelection/modalSelection';
import DateInputField from './inputFields/dateInputField';


interface ExpenseDetailsInputsProps {
    title: string,
    amount: string,
    date: string,
    category: string,
    notes: string,
    categoriesList: Array<string>,
    setTitle: (text: string) => void,
    setAmount: (text: string) => void,
    setDate: (text: string) => void,
    setCategory: (text: string) => void,
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

            <DateInputField setDate={props.setDate} />

            <View style={styles.input}>
                <ModalSelection choices={props.categoriesList} value={props.category} setValue={props.setCategory} />
            </View>

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
    input: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        fontSize: 16,
    },
})