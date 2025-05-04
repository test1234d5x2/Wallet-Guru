import { View, Text, StyleSheet, TouchableOpacity, Alert, StatusBar, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import { Link, useRouter } from 'expo-router'
import setPageTitle from '@/components/pageTitle/setPageTitle'
import AuthenticationInputs from '@/components/formComponents/authenticationInputs'
import clearRouterHistory from '@/utils/clearRouterHistory'
import saveToken from '@/utils/tokenAccess/saveToken'
import getToken from '@/utils/tokenAccess/getToken'
import verifyToken from '@/utils/apiCalls/verifyToken'
import removeToken from '@/utils/tokenAccess/deleteToken'

interface LoginResponse {
    message: string
    token: string
}

async function login(email: string, password: string): Promise<LoginResponse> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS
    if (!API_DOMAIN) {
        throw new Error('Domain could not be found')
    }

    const LOGIN_URL = `http://${API_DOMAIN}/api/users/login`

    const response = await fetch(LOGIN_URL, {
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

    const data: LoginResponse = await response.json()
    return data
}

export default function Login() {
    setPageTitle('Login')

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const router = useRouter()

    // Auto-login feature
    useEffect(() => {
        const checkToken = async () => {
            const data = await getToken()
            if (data) {
                try {
                    await verifyToken(data.token, data.email)
                    Alert.alert('You are already logged in.')
                    clearRouterHistory(router)
                    router.replace('/dashboardPage')
                } catch (err: any) {
                    console.log(err.message)
                    await removeToken()
                }
            }
        }
        checkToken()
    }, [])

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please input both email and password')
            return
        }

        try {
            const data = await login(email, password)
            await saveToken(data.token, email)
            setError('')
            clearRouterHistory(router)
            router.replace('/dashboardPage')
        } catch (error: any) {
            console.log('Login error:', error.message)
            setError(error.message || 'Failed to login. Please try again.')
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <StatusBar barStyle={'dark-content'} />
            <AuthenticationInputs email={email} password={password} setEmail={setEmail} setPassword={setPassword} />

            {error && (
                <View style={styles.errorTextContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <View style={styles.newUserTextContainer}>
                <TouchableOpacity>
                    <Link href={'/registrationPage'} replace>
                        <Text style={styles.newUserText}>New User? Register Here</Text>
                    </Link>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
        </ScrollView>
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
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    newUserTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    newUserText: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.5)',
        textDecorationLine: 'underline',
        textAlign: 'center',
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
