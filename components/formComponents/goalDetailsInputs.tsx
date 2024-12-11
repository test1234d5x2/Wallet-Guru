import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import StandardInputField from './inputFields/standardInputField';
import NumericInputField from './inputFields/numericInputField';
import DateInputField from './inputFields/dateInputField';


interface GoalDetailsInputsProps {
    title: string,
    target: string,
    date: Date,
    notes: string,
    setTitle: (text: string) => void,
    setTarget: (text: string) => void,
    setDate: (text: Date) => void,
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

            <DateInputField date={props.date} setDate={props.setDate} />

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