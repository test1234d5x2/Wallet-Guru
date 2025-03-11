import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, StatusBar } from 'react-native'
import ExpenseDetailsInputs from '@/components/formComponents/expenseDetailsInputs'
import setPageTitle from '@/components/pageTitle/setPageTitle'
import TopBar from '@/components/topBars/topBar'
import { useRouter, useLocalSearchParams } from 'expo-router'
import validateEmpty from '@/utils/validation/validateEmpty'
import isNumeric from '@/utils/validation/validateNumeric'
import { isValidDate, isTodayOrBefore } from '@/utils/validation/validateDate'
import ExpenseCategory from '@/models/core/ExpenseCategory'
import clearRouterHistory from '@/utils/clearRouterHistory'
import getToken from '@/utils/tokenAccess/getToken'
import updateExpense from '@/utils/apiCalls/updateExpense'
import getExpenseByID from '@/utils/apiCalls/getExpensesByID'
import getExpenseCategories from '@/utils/apiCalls/getExpenseCategories'
import pickImage from '@/utils/pickImage'
import updateCategoriesTimeWindowEnd from '@/utils/analytics/batchProcessRecurrencesUpdates/updateCategoriesTimeWindowEnd'

export default function EditExpense() {
    setPageTitle("Edit Expense")

    const { id } = useLocalSearchParams()
    const router = useRouter()
    const [token, setToken] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [categories, setCategories] = useState<ExpenseCategory[]>([])
    const [title, setTitle] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [date, setDate] = useState<Date>(new Date())
    const [category, setCategory] = useState<ExpenseCategory>()
    const [notes, setNotes] = useState<string>('')
    const [receipt, setReceipt] = useState<string>('')
    const [error, setError] = useState<string>('')

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
            const result = await getExpenseCategories(token)
            if (result) {
                setCategories(result)
                await updateCategoriesTimeWindowEnd(result, token)
            } else {
                console.log("Error with getting expense categories list")
            }
        }

        if (token) {
            getCategories()
        }
    }, [token])

    useEffect(() => {
        async function getExpense() {
            getExpenseByID(token, id as string).then((expense) => {
                setTitle(expense.title)
                setAmount(expense.amount.toString())
                setDate(expense.date)
                setNotes(expense.notes)
                if (categories) {
                    setCategory(categories.find((cat) => expense.categoryID === cat.getID()))
                }
            }).catch((error: Error) => {
                Alert.alert("Expense Not Found")
                console.log(error.message)
                clearRouterHistory(router)
                router.replace("/listTransactionsPage")
            })
        }

        if (token && categories) {
            getExpense()
        }
    }, [token, categories])

    const validateForm = () => {
        if (!title || !amount || !date || !category) {
            setError("Fill in all the required fields")
            return false
        }

        if (validateEmpty(title)) {
            setError("The title field must be filled properly")
            return false
        }

        if (validateEmpty(amount)) {
            setError("The amount field must be filled properly")
            return false
        }

        if (!isNumeric(amount)) {
            setError("The amount field must be a number")
            return false
        }

        if (!isValidDate(date)) {
            setError("Please select a date")
            return false
        }

        if (!isTodayOrBefore(date)) {
            setError("Please select a date that is today or before today")
            return false
        }

        setError("")
        return true
    }

    const handleEditExpense = () => {
        if (validateForm()) {
            if (!category) return
            updateExpense(token, id as string, title, parseFloat(amount), date, notes, category.getID(), receipt).then((complete) => {
                if (!complete) return
                Alert.alert('Success', 'Expense updated successfully!')
                clearRouterHistory(router)
                router.replace(`/viewExpenseDetailsPage/${id}`)
            }).catch((error: Error) => {
                setError(error.message)
            })
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TopBar />
            <StatusBar barStyle={"dark-content"} />

            <View style={styles.expenseForm}>
                <ExpenseDetailsInputs
                    title={title}
                    amount={amount}
                    date={date}
                    category={category === undefined ? null : category}
                    notes={notes}
                    categoriesList={categories}
                    setTitle={setTitle}
                    setAmount={setAmount}
                    setDate={setDate}
                    setCategory={setCategory}
                    setNotes={setNotes}
                />
            </View>

            {receipt ? <View style={styles.centeredTextContainer}><Text>Receipt Set</Text></View> : ""}

            {error ? <View style={styles.centeredTextContainer}><Text style={styles.errorText}>{error}</Text></View> : null}

            <View style={styles.centeredTextContainer}>
                <TouchableOpacity onPress={() => pickImage(setReceipt)}>
                    <Text style={styles.scanText}>Upload Receipt</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleEditExpense}>
                <Text style={styles.addButtonText}>Edit Expense</Text>
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
    expenseForm: {
        marginBottom: 40
    },
    scanText: {
        color: '#777',
        textDecorationLine: 'underline'
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
