import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, StatusBar } from 'react-native'
import setPageTitle from '@/components/pageTitle/setPageTitle'
import TopBar from '@/components/topBars/topBar'
import validateEmpty from '@/utils/validation/validateEmpty'
import isNumeric from '@/utils/validation/validateNumeric'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { isValidDate, isTodayOrBefore } from '@/utils/validation/validateDate'
import clearRouterHistory from '@/utils/clearRouterHistory'
import getToken from '@/utils/tokenAccess/getToken'
import Frequency from '@/enums/Frequency'
import RecurrentIncomeDetailsInputs from '@/components/formComponents/recurrentIncomeInputs'
import isInteger from '@/utils/validation/validateInteger'
import isValidFrequency from '@/utils/validation/isValidFrequency'
import getRecurringIncomeByID from '@/utils/apiCalls/getRecurringIncomeByID'
import updateRecurrentIncome from '@/utils/apiCalls/updateReccuringIncome'
import BasicRecurrenceRule from '@/models/recurrenceModels/BasicRecurrenceRule'
import IncomeCategory from '@/models/core/IncomeCategory'
import getIncomeCategories from '@/utils/apiCalls/getIncomeCategories'
import updateCategoriesTimeWindowEnd from '@/utils/analytics/batchProcessRecurrencesUpdates/updateCategoriesTimeWindowEnd'

export default function EditRecurrentIncome() {
    setPageTitle("Edit Recurrent Income")

    const { id } = useLocalSearchParams()
    const [token, setToken] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [categories, setCategories] = useState<IncomeCategory[]>([])
    const [title, setTitle] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [category, setCategory] = useState<IncomeCategory>()
    const [frequency, setFrequency] = useState<Frequency>(Frequency.Daily)
    const [interval, setFrequencyInterval] = useState<string>('')
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [notes, setNotes] = useState<string>('')
    const [error, setError] = useState<string>('')
    const router = useRouter()

    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to access this page.')
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
                console.log("Error with getting expense categories list.")
            }
        }

        getCategories()
    }, [token])

    useEffect(() => {
        async function getIncome() {
            getRecurringIncomeByID(token, id as string).then((data) => {
                setTitle(data.title)
                setAmount(data.amount.toString())
                setNotes(data.notes)
                setFrequency(data.recurrenceRule.frequency)
                setFrequencyInterval(data.recurrenceRule.interval.toString())
                setStartDate(data.recurrenceRule.startDate)
                setEndDate(data.recurrenceRule.endDate || null)
                if (categories) setCategory(categories.find((cat) => cat.getID() === data.categoryID))
            }).catch((error: Error) => {
                Alert.alert("Recurrent Income Not Found")
                console.log(error.message)
                clearRouterHistory(router)
                router.replace("/listRecurringTransactionsPage")
            })
        }

        if (token) getIncome()
    }, [token])

    const validateForm = (): boolean => {
        if (!title || !amount || !startDate || !frequency || !interval) {
            setError("Fill in all the required fields.")
            return false
        }

        if (validateEmpty(title.trim())) {
            setError("The title field must be filled properly.")
            return false
        }

        if (validateEmpty(amount)) {
            setError("The amount field must be filled properly.")
            return false
        }
        else if (!isNumeric(amount)) {
            setError("The amount field must be a number greater than 0.")
            return false
        }
        else if (parseFloat(amount) <= 0) {
            setError("The amount field must be a number greater than 0.")
            return false
        }

        if (!isValidDate(startDate)) {
            setError("Please select a valid date.")
            return false
        }

        if (endDate && !isValidDate(endDate)) {
            setError("Please select a valid date.")
            return false
        }

        if (!isValidFrequency(frequency)) {
            setError("Please select a valid frequency.")
            return false
        }

        if (!isInteger(interval)) {
            setError("Please select a date.")
            return false
        }
        else if (parseInt(interval) <= 0) {
            setError("Please select a date.")
            return false
        }

        if (endDate && endDate <= startDate) {
            setError("End date must be after the start date.")
            return false
        }

        setError("")
        return true
    }

    const handleEditRecurrentIncome = () => {
        if (validateForm()) {
            const recurrenceRule = new BasicRecurrenceRule(frequency, parseFloat(interval), startDate as Date, undefined, endDate as Date)
            updateRecurrentIncome(token, id as string, title, parseFloat(amount), new Date(), notes, (category as IncomeCategory).getID(), recurrenceRule).then((data) => {
                Alert.alert('Success', 'Recurrent income added successfully!')
                clearRouterHistory(router)
                router.replace("/listRecurringTransactionsPage")
            }).catch((error: Error) => {
                setError(error.message)
            })
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TopBar />
            <StatusBar barStyle={"dark-content"} />

            <View style={styles.incomeForm}>
                <RecurrentIncomeDetailsInputs
                    title={title}
                    amount={amount}
                    category={category === undefined ? null : category}
                    notes={notes}
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
                    setCategory={setCategory}
                    categoriesList={categories}
                />
            </View>

            {error ? <View style={styles.centeredTextContainer}><Text style={styles.errorText}>{error}</Text></View> : null}

            <TouchableOpacity style={styles.editButton} onPress={handleEditRecurrentIncome}>
                <Text style={styles.editButtonText}>Edit Recurrent Income</Text>
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
        flex: 1
    },
    incomeForm: {
        marginBottom: 40
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
    },
    centeredTextContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    errorText: {
        color: 'red',
        fontSize: 14
    }
})
