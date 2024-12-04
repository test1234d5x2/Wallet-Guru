import React from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';

interface AuthenticationInputsProps {
    email: string,
    password: string
    setEmail: (text: string) => void,
    setPassword: (text: string) => void,

}

export default function AuthenticationInputs(props: AuthenticationInputsProps) {
    return (
        <View style={styles.container}>

            <TextInput
                style={styles.input}
                placeholder={"Email"}
                placeholderTextColor={"rgba(0,0,0,0.25)"}
                value={props.email}
                onChangeText={props.setEmail}
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder={"Password"}
                placeholderTextColor={"rgba(0,0,0,0.25)"}
                value={props.password}
                onChangeText={props.setPassword}
                secureTextEntry={true}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 20,
        padding: 20,
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
})