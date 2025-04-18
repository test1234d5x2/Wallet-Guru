import React from 'react'
import { TextInput, StyleSheet, View, Text } from 'react-native'


interface NumericInputProps {
    value: string
    placeholder: string
    setValue: (text: string) => void
    required?: boolean
}

export default function NumericInputField(props: NumericInputProps) {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder={props.placeholder}
                placeholderTextColor={"rgba(0,0,0,0.25)"}
                value={props.value}
                onChangeText={props.setValue}
                keyboardType='decimal-pad'
            />
            <Text style={styles.requiredText}>{props.required ? "Required" : "Optional"}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        rowGap: 5,
        width: "100%",
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
    requiredText: {
        paddingLeft: 15,
        color: "rgba(0,0,0,0.55)",
        fontSize: 12,
    }
})