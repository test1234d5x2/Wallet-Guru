import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import StandardInputField from './inputFields/standardInputField';
import NumericInputField from './inputFields/numericInputField';


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

            <StandardInputField
                placeholder="Date"
                value={props.date}
                setValue={props.setDate}
            />

            <View style={styles.pickerContainer}>
                <Picker selectedValue={props.category} onValueChange={(itemValue) => {props.setCategory(itemValue)}} selectionColor={"white"}>
                    <Picker.Item label="Select Category" value="Select Category" color="black" />
                    <Picker.Item label="Food" value="Food" color="black" />
                    <Picker.Item label="Transport" value="Transport" color="black" />
                    <Picker.Item label="Shopping" value="Shopping" color="black" />
                    <Picker.Item label="Bills" value="Bills" color="black" />
                    <Picker.Item label="Other" value="Other" color="black" />
                </Picker>
            </View>

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
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    picker: {
        backgroundColor: "black",
        color: "white",
    },
});