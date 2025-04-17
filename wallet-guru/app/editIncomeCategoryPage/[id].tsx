import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, StatusBar } from 'react-native'
import IncomeCategoryInputs from '@/components/formComponents/incomeCategoryInputs'
import setPageTitle from '@/components/pageTitle/setPageTitle'
import TopBar from '@/components/topBars/topBar'
import { useRouter, useLocalSearchParams } from 'expo-router'
import validateEmpty from '@/utils/validation/validateEmpty'
import clearRouterHistory from '@/utils/clearRouterHistory'
import getToken from '@/utils/tokenAccess/getToken'
import getIncomeCategoryByID from '@/utils/apiCalls/getIncomeCategoryByID'
import updateIncomeCategory from '@/utils/apiCalls/updateIncomeCategory'
import getIncomeCategories from '@/utils/apiCalls/getIncomeCategories'
import IncomeCategory from '@/models/core/IncomeCategory'
import getColourSelection from '@/utils/getColourSelection'

export default function EditIncomeCategory() {
    setPageTitle('Edit Income Category')

    const { id } = useLocalSearchParams()
    const router = useRouter()
    const [token, setToken] = useState<string>('')
    const [categories, setCategories] = useState<IncomeCategory[]>([])
    const [categoryName, setCategoryName] = useState<string>('')
    const [colour, setColour] = useState<string | null>(null)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        getToken().then(data => {
            if (!data) {
                Alert.alert('Error', 'You must be logged in to access this page.')
                clearRouterHistory(router)
                router.replace('/loginPage')
                return
            }
            setToken(data.token)
            getIncomeCategoryByID(data.token, id as string)
                .then(category => {
                    setCategoryName(category.name)
                    setColour(category.colour)
                })
                .catch(() => {
                    Alert.alert('Income Category Not Found')
                    clearRouterHistory(router)
                    router.replace('/incomeCategoriesOverviewPage')
                })
        })
    }, [])

    useEffect(() => {
        if (!token) return
        getIncomeCategories(token)
            .then(result => {
                if (result) setCategories(result)
            })
            .catch(() => console.log('Error fetching income categories'))
    }, [token])

    const validateForm = (): boolean => {
        if (!categoryName || !colour) {
            setError('Please fill in all the fields.')
            return false
        }
        if (validateEmpty(categoryName)) {
            setError('The category name field must be filled properly.')
            return false
        }
        const duplicate = categories.find(
            cat => cat.name.toLowerCase() === categoryName.toLowerCase() && cat.getId() !== id
        )
        if (duplicate) {
            setError('This category already exists.')
            return false
        }
        setError('')
        return true
    }

    const handleEditCategory = () => {
        if (!token) return
        if (validateForm()) {
            updateIncomeCategory(token, id as string, categoryName, colour as string)
                .then(success => {
                    if (success) {
                        Alert.alert('Success', `Category "${categoryName}" updated`)
                        clearRouterHistory(router)
                        router.replace('/incomeCategoriesOverviewPage')
                    }
                })
                .catch((e: Error) => setError(e.message))
        }
    }

    return (
        <View style={styles.container}>
            <TopBar />
            <StatusBar barStyle={'dark-content'} />

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

            <TouchableOpacity style={styles.editButton} onPress={handleEditCategory}>
                <Text style={styles.editButtonText}>Edit Category</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
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
    editButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center'
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }
})
