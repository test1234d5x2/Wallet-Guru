import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";
import AuthenticationInputs from "@/components/formComponents/authenticationInputs";
import setPageTitle from "@/components/pageTitle/setPageTitle";


export default function Login() {

    setPageTitle("Create User")

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')


    const handleRegistration = () => {
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

            <View style={styles.registeredUserTextContainer}>
                <TouchableOpacity>
                    <Link href={"/login/loginPage"}>
                        <Text style={styles.registeredUserText}>Already Registered? Login Here</Text>
                    </Link>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleRegistration}>
                <Text style={styles.loginButtonText}>Register</Text>
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
    registeredUserTextContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    registeredUserText: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.5)',
        textDecorationLine: 'underline',
        textAlign: "center",
        width: "100%",
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