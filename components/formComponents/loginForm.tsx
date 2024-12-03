import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function LoginForm() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleLogin = () => {
        if (!email || !password) {
            setError('Please enter both email and password')
            Alert.alert("An error message")
            return;
        }
    }

    return (
        <View style={styles.container}>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>New User? Register Here</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: '#5480D4',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotPasswordText: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.5)',
        textDecorationLine: 'underline',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
})