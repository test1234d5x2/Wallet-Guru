import { View, Text, StyleSheet, TouchableOpacity, Alert, StatusBar, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import AuthenticationInputs from '@/components/formComponents/authenticationInputs'
import setPageTitle from '@/components/pageTitle/setPageTitle'
import { useRouter } from 'expo-router'
import isValidEmail from '@/utils/validation/validateEmail'
import clearRouterHistory from '@/utils/clearRouterHistory'
import saveFile from '@/utils/saveFile'

async function createUser(email: string, password: string): Promise<string> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS
    if (!API_DOMAIN) {
        throw new Error('Domain could not be found.')
    }

    const CREATE_USER_URL = `http://${API_DOMAIN}/api/users/`

    const response = await fetch(CREATE_USER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }

    const data = await response.json()
    const credentials = data.data
    return credentials
}

export default function Register() {
    setPageTitle('Create User')

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    const handleRedirection = () => {
        clearRouterHistory(router)
        router.replace('/loginPage')
    }

    const handleRegistration = async () => {
        if (!email || !password) {
            setError('Please input both email and password')
            return
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email.')
            return
        }

        setIsLoading(true)

        try {
            const credentials = await createUser(email, password)
            Alert.alert('User Registration Success', 'Please store the upcoming file very safely as these are your credentials!', [
                {
                    text: "OK", onPress: () => {saveFile('credentials.id', credentials)}
                }
            ])
            
            handleRedirection()
        } catch (error: any) {
            console.log('Registration error:', error.message)
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle={'dark-content'} />
            <AuthenticationInputs email={email} password={password} setEmail={setEmail} setPassword={setPassword} />

            {error && (
                <View style={styles.errorTextContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <View style={styles.registeredUserTextContainer}>
                <TouchableOpacity onPress={handleRedirection}>
                    <Text style={styles.registeredUserText}>Already Registered? Login Here</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleRegistration} disabled={isLoading}>
                { isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Register</Text> }
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
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
        justifyContent: 'center',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registeredUserTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    registeredUserText: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.5)',
        textDecorationLine: 'underline',
        textAlign: 'center',
        width: '100%',
    },
    errorTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
    },
})
