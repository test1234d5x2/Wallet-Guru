import React from 'react';
import { TextInput, StyleSheet } from 'react-native';


interface StandardInputProps {
    value: string
    placeholder: string
    setValue: (text: string) => void
}

export default function StandardInputField(props: StandardInputProps) {
    return (
        <TextInput 
            style={styles.input}
            placeholder={props.placeholder}
            placeholderTextColor={"rgba(0,0,0,0.25)"}
            value={props.value}
            onChangeText={props.setValue}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        fontSize: 16,
    },
})