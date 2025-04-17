import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, StatusBar, ScrollView, ActivityIndicator } from 'react-native'
import IncomeCategoryInputs from '@/components/formComponents/incomeCategoryInputs'
import setPageTitle from '@/components/pageTitle/setPageTitle'
import TopBar from '@/components/topBars/topBar'
import validateEmpty from '@/utils/validation/validateEmpty'
import clearRouterHistory from '@/utils/clearRouterHistory'
import { useRouter } from 'expo-router'
import getToken from '@/utils/tokenAccess/getToken'
import IncomeCategory from '@/models/core/IncomeCategory'
import getIncomeCategories from '@/utils/apiCalls/getIncomeCategories'
import getColourSelection from '@/utils/getColourSelection'

async function addIncomeCategory(token: string, name: string, colour: string) {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS
    if (!API_DOMAIN) {
        throw new Error('Domain could not be found')
    }

    const ADD_INCOME_CATEGORY_URL = `http://${API_DOMAIN}/api/income-categories/`

    const response = await fetch(ADD_INCOME_CATEGORY_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, colour })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
    }
}

export default function AddIncomeCategory() {
    setPageTitle('Add Income Category')

    const [token, setToken] = useState<string>('')
    const [categories, setCategories] = useState<IncomeCategory[]>([])
    const [categoryName, setCategoryName] = useState<string>('')
    const [colour, setColour] = useState<string | null>(null)
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        getToken().then(data => {
            if (!data) {
                Alert.alert('Error', 'You must be logged in to access this page')
                clearRouterHistory(router)
                router.replace('/loginPage')
                return
            }
            setToken(data.token)
            getIncomeCategories(data.token)
                .then(res => {
                    if (res) setCategories(res)
                })
                .catch(() => console.log('Error fetching income categories'))
        })
    }, [])

    const validateForm = (): boolean => {
        if (!categoryName || !colour) {
            setError('Please fill in all the fields')
            return false
        }
        if (validateEmpty(categoryName)) {
            setError('The category name field must be filled properly')
            return false
        }
        const duplicate = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase())
        if (duplicate) {
            setError('This category already exists')
            return false
        }
        setError('')
        return true
    }

    const handleAddCategory = () => {
        if (!token) return
        if (validateForm()) {
            setIsLoading(true)
            addIncomeCategory(token, categoryName, colour as string)
                .then(() => {
                    Alert.alert('Success', `Category "${categoryName}" added`)
                    clearRouterHistory(router)
                    router.replace('/incomeCategoriesOverviewPage')
                })
                .catch((e: Error) => setError(e.message))
                .finally(() => setIsLoading(false))
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <StatusBar barStyle={'dark-content'} />
            <TopBar />

            <View style={styles.formContainer}>
                <IncomeCategoryInputs
                    categoryName={categoryName}
                    colour={colour}
                    colourChoices={getColourSelection()}
                    setCategoryName={setCategoryName}
                    setColour={setColour}
                />
            </View>

            {error !== '' && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.addButton} onPress={handleAddCategory} disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator color='#fff' />
                ) : (
                    <Text style={styles.addButtonText}>Add Category</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        minHeight: Dimensions.get('window').height,
        rowGap: 20
    },
    formContainer: {
        marginBottom: 40
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        textAlign: 'center'
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center'
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }
})
