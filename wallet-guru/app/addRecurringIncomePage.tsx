import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, StatusBar, ActivityIndicator } from 'react-native'
import setPageTitle from '@/components/pageTitle/setPageTitle'
import TopBar from '@/components/topBars/topBar'
import validateEmpty from '@/utils/validation/validateEmpty'
import isNumeric from '@/utils/validation/validateNumeric'
import { useRouter } from 'expo-router'
import { isValidDate } from '@/utils/validation/validateDate'
import clearRouterHistory from '@/utils/clearRouterHistory'
import getToken from '@/utils/tokenAccess/getToken'
import Frequency from '@/enums/Frequency'
import RecurrentIncomeDetailsInputs from '@/components/formComponents/recurrentIncomeInputs'
import isInteger from '@/utils/validation/validateInteger'
import isValidFrequency from '@/utils/validation/isValidFrequency'
import RecurrenceRule from '@/models/recurrenceModels/RecurrenceRule'
import BasicRecurrenceRule from '@/models/recurrenceModels/BasicRecurrenceRule'
import IncomeCategory from '@/models/core/IncomeCategory'
import getIncomeCategories from '@/utils/apiCalls/getIncomeCategories'


async function addRecurrentIncome(token: string, title: string, amount: number, date: Date, notes: string, categoryID: string, recurrenceRule: RecurrenceRule) {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found")
    }

    const ADD_INCOME_URL = `http://${API_DOMAIN}/api/recurring-incomes/`

    const response = await fetch(ADD_INCOME_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            amount,
            date,
            notes,
            categoryID,
            recurrenceRule
        })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }
}

export default function AddRecurrentIncome() {
    setPageTitle("Add Recurrent Income")

    const [token, setToken] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [categories, setCategories] = useState<IncomeCategory[]>([])
    const [title, setTitle] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const [category, setCategory] = useState<IncomeCategory | null>(null)
    const [frequency, setFrequency] = useState<Frequency>(Frequency.Daily)
    const [interval, setFrequencyInterval] = useState<string>("")
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [notes, setNotes] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to access this page')
            clearRouterHistory(router)
            router.replace("/loginPage")
            return
        }

        setToken(data.token)
        setEmail(data.email)
    })

    useEffect(() => {
        async function getCategories() {
            const result = await getIncomeCategories(token)
            if (result) {
                setCategories(result)
            } else {
                console.log("Error with getting expense categories list")
            }
        }

        getCategories()
    }, [token])


    const validateForm = (): boolean => {
        if (!title || !amount || !startDate || !frequency || !interval) {
            setError("Fill in all the required fields")
            return false
        }

        if (validateEmpty(title.trim())) {
            setError("The title field must be filled properly")
            return false
        }

        if (validateEmpty(amount)) {
            setError("The amount field must be filled properly")
            return false
        } else if (!isNumeric(amount)) {
            setError("The amount field must be a number greater than 0")
            return false
        } else if (parseFloat(amount) <= 0) {
            setError("The amount field must be a number greater than 0")
            return false
        }

        if (!isValidDate(startDate)) {
            setError("Please select a valid date")
            return false
        }

        if (endDate && !isValidDate(endDate)) {
            setError("Please select a valid date")
            return false
        }

        if (!isValidFrequency(frequency)) {
            setError("Please select a valid frequency")
            return false
        }

        if (!isInteger(interval)) {
            setError("Please select a valid interval")
            return false
        } else if (parseInt(interval) <= 0) {
            setError("Please select a valid interval")
            return false
        }

        if (endDate && endDate <= startDate) {
            setError("End date must be after the start date")
            return false
        }

        setError("")
        return true
    }

    const handleAddRecurrentIncome = () => {
        if (validateForm()) {
            setIsLoading(true)

            const recurrenceRule = new BasicRecurrenceRule(
                frequency,
                parseFloat(interval),
                startDate as Date,
                undefined,
                endDate as Date
            )

            addRecurrentIncome(token, title, parseFloat(amount), new Date(), notes, (category as IncomeCategory).getID(), recurrenceRule)
                .then(() => {
                    Alert.alert('Success', 'Income added successfully!')
                    clearRouterHistory(router)
                    router.replace("/listRecurringTransactionsPage")
                })
                .catch((error: Error) => {
                    setError(error.message)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle={"dark-content"} />
            <TopBar />

            <View style={styles.incomeForm}>
                <RecurrentIncomeDetailsInputs
                    title={title}
                    amount={amount}
                    notes={notes}
                    category={category}
                    frequency={frequency}
                    interval={interval}
                    startDate={startDate}
                    endDate={endDate}
                    setTitle={setTitle}
                    setAmount={setAmount}
                    setNotes={setNotes}
                    setFrequency={setFrequency}
                    setFrequencyInterval={setFrequencyInterval}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    categoriesList={categories}
                    setCategory={setCategory}
                />
            </View>

            {error ? (
                <View style={styles.centeredTextContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : null}

            <TouchableOpacity style={styles.addButton} onPress={handleAddRecurrentIncome} disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.addButtonText}>Add Recurrent Income</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        rowGap: 20,
        padding: 20,
        backgroundColor: '#fff',
    },
    incomeForm: {
        marginBottom: 40,
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    centeredTextContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: 'red',
        fontSize: 14,
    },
})
