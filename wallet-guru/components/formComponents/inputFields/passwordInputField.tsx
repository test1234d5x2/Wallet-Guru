import React from 'react';
import { TextInput, StyleSheet } from 'react-native';


interface PasswordFieldProps {
    password: string;
    setPassword: (text: string) => void;
    placeholder?: string;
}

export default function PasswordInputField(props: PasswordFieldProps) {
    return (
        <TextInput 
            style={styles.input}
            placeholder={props.placeholder || "Password"}
            placeholderTextColor={"rgba(0,0,0,0.25)"}
            value={props.password}
            onChangeText={props.setPassword}
            secureTextEntry={true}
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