import React from 'react';
import { TextInput, StyleSheet } from 'react-native';


interface EmailFieldProps {
    email: string
    setEmail: (text: string) => void
}

export default function EmailInputField(props: EmailFieldProps) {
    return (
        <TextInput 
            style={styles.input}
            placeholder={"Email"}
            placeholderTextColor={"rgba(0,0,0,0.25)"}
            value={props.email}
            onChangeText={props.setEmail}
            keyboardType="email-address"
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