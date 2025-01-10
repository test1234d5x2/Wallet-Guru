import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import AuthenticationInputs from "@/components/formComponents/authenticationInputs";
import setPageTitle from "@/components/pageTitle/setPageTitle";
import { useRouter } from "expo-router";
import isValidEmail from "@/utils/validateEmail";
import Registry from "@/models/data/Registry";
import clearRouterHistory from "@/utils/clearRouterHistory";

export default function Register() {
    setPageTitle("Create User");

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const registry = Registry.getInstance();
    const userService = registry.userService;

    const handleRedirection = () => {
        clearRouterHistory(router);
        router.replace("/loginPage");
        return;
    };

    const handleRegistration = () => {
        if (!email || !password) {
            setError("Please input both email and password");
            Alert.alert("Please input both email and password");
            return;
        }

        if (!isValidEmail(email)) {
            setError("Please enter a valid email.");
            Alert.alert("Invalid Email", "Please enter a valid email.");
            return;
        }

        const existingUser = userService.userExists(email);
        if (existingUser) {
            setError("User already exists.");
            Alert.alert("Error", "User already exists.");
            return;
        }

        userService.addUser(email, password);

        Alert.alert("Success", "User registered successfully!");
        setError("");
        handleRedirection();
    };

    return (
        <View style={styles.container}>
            <AuthenticationInputs email={email} password={password} setEmail={setEmail} setPassword={setPassword} />

            {error ? (
                <View style={styles.errorTextContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : null}

            <View style={styles.registeredUserTextContainer}>
                <TouchableOpacity onPress={handleRedirection}>
                    <Text style={styles.registeredUserText}>Already Registered? Login Here</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleRegistration}>
                <Text style={styles.loginButtonText}>Register</Text>
            </TouchableOpacity>
        </View>
    );
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
        alignItems: "center",
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
        alignItems: "center",
    },
    errorText: {
        color: 'red',
        fontSize: 14,
    },
});
