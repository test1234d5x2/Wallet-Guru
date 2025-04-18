import React from 'react'
import { TextInput, StyleSheet, View, Text } from 'react-native'


interface PasswordFieldProps {
    password: string
    setPassword: (text: string) => void
    placeholder?: string
    required?: boolean
}

export default function PasswordInputField(props: PasswordFieldProps) {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder={props.placeholder || "Password"}
                placeholderTextColor={"rgba(0,0,0,0.25)"}
                value={props.password}
                onChangeText={props.setPassword}
                secureTextEntry={true}
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