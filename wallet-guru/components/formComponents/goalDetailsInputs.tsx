import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import StandardInputField from './inputFields/standardInputField';
import NumericInputField from './inputFields/numericInputField';
import DateInputField from './inputFields/dateInputField';


interface GoalDetailsInputsProps {
    title: string,
    target: string,
    date: Date | null,
    description: string,
    setTitle: (text: string) => void,
    setTarget: (text: string) => void,
    setDate: (text: Date) => void,
    setDesc: (text: string) => void,
}


export default function GoalDetailsInputs(props: GoalDetailsInputsProps) {
    return (
        <ScrollView contentContainerStyle={styles.container}>

            <StandardInputField
                placeholder="Title"
                value={props.title}
                setValue={props.setTitle}
                required
            />

            <NumericInputField
                placeholder="Target"
                value={props.target}
                setValue={props.setTarget}
                required
            />

            <DateInputField date={props.date} setDate={props.setDate} required />

            <StandardInputField
                placeholder="Description"
                value={props.description}
                setValue={props.setDesc}
                required
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