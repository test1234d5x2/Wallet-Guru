import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import EmailInputField from './inputFields/emailInputField';
import PasswordInputField from './inputFields/passwordInputField';

interface AuthenticationInputsProps {
    email: string,
    password: string
    setEmail: (text: string) => void,
    setPassword: (text: string) => void,

}

export default function AuthenticationInputs(props: AuthenticationInputsProps) {
    return (
        <View style={styles.container}>

            <EmailInputField
                email={props.email}
                setEmail={(props.setEmail)}
            />

            <PasswordInputField
                password={props.password}
                setPassword={props.setPassword} 
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