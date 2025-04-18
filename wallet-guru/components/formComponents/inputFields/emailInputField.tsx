import React from 'react'
import { TextInput, StyleSheet, View, Text } from 'react-native'


interface EmailFieldProps {
    email: string
    setEmail: (text: string) => void
    required?: boolean
}

export default function EmailInputField(props: EmailFieldProps) {
    return (

        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder={"Email"}
                placeholderTextColor={"rgba(0,0,0,0.25)"}
                value={props.email}
                onChangeText={props.setEmail}
                keyboardType="email-address"
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