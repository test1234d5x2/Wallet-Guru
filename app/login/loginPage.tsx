import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";
import setPageTitle from "@/components/pageTitle/setPageTitle";
import AuthenticationInputs from "@/components/formComponents/authenticationInputs";

export default function Login() {

    setPageTitle("Login")

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')


    const handleLogin = () => {
        if (!email || !password) {
            setError("Please input both email and password")
            Alert.alert("Please input both email and password")
            return
        }
    }

    return (
        <View style={styles.container}>
            <AuthenticationInputs email={email} password={password} setEmail={setEmail} setPassword={setPassword} />


            {error ? <View style={styles.errorTextContainer}><Text style={styles.errorText}>{error}</Text></View> : null}

            <View style={styles.newUserTextContainer}>
                <TouchableOpacity>
                    <Link href={"/registration/registrationPage"} replace={true}>
                        <Text style={styles.newUserText}>New User? Register Here</Text>
                    </Link>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        rowGap: 20,
        padding: 20,
    },
    loginButton: {
        backgroundColor: '#5480D4',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    newUserTextContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    newUserText: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.5)',
        textDecorationLine: 'underline',
        textAlign: "center"
    },
    errorTextContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    errorText: {
        color: 'red',
        fontSize: 14,
    },
})