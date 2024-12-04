import React from 'react';
import { View, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';


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