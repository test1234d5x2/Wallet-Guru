import React from 'react';
import { TextInput, StyleSheet, ScrollView } from 'react-native';
import StandardInputField from './inputFields/standardInputField';
import NumericInputField from './inputFields/numericInputField';


interface GoalDetailsInputsProps {
    title: string,
    target: string,
    date: string,
    notes: string,
    setTitle: (text: string) => void,
    setTarget: (text: string) => void,
    setDate: (text: string) => void,
    setNotes: (text: string) => void,
}


export default function GoalDetailsInputs(props: GoalDetailsInputsProps) {

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <StandardInputField
                placeholder="Title"
                value={props.title}
                setValue={props.setTitle}
            />

            <NumericInputField
                placeholder="Target"
                value={props.target}
                setValue={props.setTarget}
            />

            <StandardInputField
                placeholder="Date"
                value={props.date}
                setValue={props.setDate}
            />

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