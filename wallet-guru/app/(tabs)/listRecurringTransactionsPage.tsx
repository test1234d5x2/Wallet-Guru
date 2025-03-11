import React, { useEffect, useState } from 'react'
import { Link, useRouter } from 'expo-router'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native'
import setPageTitle from '@/components/pageTitle/setPageTitle'
import TopBar from '@/components/topBars/topBar'
import uuid from 'react-native-uuid'
import Transaction from '@/models/core/Transaction'
import clearRouterHistory from '@/utils/clearRouterHistory'
import ExpenseCategory from '@/models/core/ExpenseCategory'
import DateInputField from '@/components/formComponents/inputFields/dateInputField'
import ModalSelectionExpenseCategories from '@/components/modalSelection/modalSelectionExpenseCategories'
import ModalSelectionTransactionTypes from '@/components/modalSelection/modalSelectionTransactionTypes'
import TransactionType from '@/enums/TransactionType'
import filterExpensesByCategory from '@/utils/filterExpensesByCategory'
import getExpenseCategories from '@/utils/apiCalls/getExpenseCategories'
import getToken from '@/utils/tokenAccess/getToken'
import RecurringExpense from '@/models/recurrenceModels/RecurringExpense'
import RecurringIncome from '@/models/recurrenceModels/RecurringIncome'
import getRecurringExpenses from '@/utils/apiCalls/getRecurringExpenses'
import getRecurringIncomes from '@/utils/apiCalls/getReccuringIncomes'
import RecurringExpenseItem from '@/components/listItems/recurringExpenseItem'
import RecurringIncomeItem from '@/components/listItems/recurringIncomeItem'
import filterTransactionsByTimeWindow from '@/utils/filterTransactionsByTimeWindow'
import updateCategoriesTimeWindowEnd from '@/utils/analytics/batchProcessRecurrencesUpdates/updateCategoriesTimeWindowEnd'

export default function ViewReccuringTransactionsList() {
    setPageTitle("Recurring Transactions")

    const router = useRouter()
    const [token, setToken] = useState<string>('')
    const [selectedType, setSelectedType] = useState<TransactionType | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null)
    const [filterStartDate, setFilterStartDate] = useState<Date | null>(null)
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(null)
    const [categories, setCategories] = useState<ExpenseCategory[]>([])
    const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([])
    const [recurringIncomes, setRecurringIncomes] = useState<RecurringIncome[]>([])

    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to access this page')
            clearRouterHistory(router)
            router.replace("/loginPage")
            return
        }

        setToken(data.token)
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

        getCategories()
    }, [token])

    useEffect(() => {
        async function getExpenseList() {
            const result = await getRecurringExpenses(token)
            if (result) {
                setRecurringExpenses(result)
            } else {
                console.log("Error with getting recurring expenses list")
            }
        }

        getExpenseList()
    }, [token, categories])

    useEffect(() => {
        async function getIncomesList() {
            const result = await getRecurringIncomes(token)
            if (result) {
                console.log("Here")
                setRecurringIncomes(result)
            } else {
                console.log("Error with getting recurring incomes list")
            }
        }

        getIncomesList()
    }, [token])

    const handleTransactionClick = (transaction: Transaction) => {
        clearRouterHistory(router)
        router.navigate(transaction.getPageURL())
    }

    let tomorrow = new Date()
    tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1))

    const combinedTransactions = []

    if (selectedType !== TransactionType.EXPENSE) {
        const filteredRecurringIncomes = filterTransactionsByTimeWindow(
            recurringIncomes,
            filterStartDate === null ? new Date(1800, 0, 1) : filterStartDate,
            filterEndDate === null ? tomorrow : filterEndDate
        )
        combinedTransactions.push(
            ...filteredRecurringIncomes.map((ri) => ({ type: 'recurringIncome', data: ri }))
        )
    }

    if (selectedType !== TransactionType.INCOME) {
        let filteredRecurringExpenses = filterTransactionsByTimeWindow(
            recurringExpenses,
            filterStartDate === null ? new Date(1800, 0, 1) : filterStartDate,
            filterEndDate === null ? tomorrow : filterEndDate
        )
        if (selectedCategory) {
            filteredRecurringExpenses = filterExpensesByCategory(filteredRecurringExpenses, selectedCategory)
        }
        combinedTransactions.push(
            ...filteredRecurringExpenses.map((rx) => ({ type: 'recurringExpense', data: rx }))
        )
    }

    combinedTransactions.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

    const transactionDisplayElements = combinedTransactions.map((item) => (
        <React.Fragment key={uuid.v4() as string}>
            <StatusBar barStyle={"dark-content"} />
            <TouchableOpacity onPress={() => handleTransactionClick(item.data)}>
                {item.type === 'recurringIncome' ? (
                    <RecurringIncomeItem token={token} recurringIncome={item.data as RecurringIncome} />
                ) : (
                    <RecurringExpenseItem
                        token={token}
                        recurringExpense={item.data as RecurringExpense}
                        categoryName={categories.find((cat) => cat.getID() === (item.data as RecurringExpense).categoryID)?.name || ""}
                    />
                )}
            </TouchableOpacity>
            <View style={styles.divider} />
        </React.Fragment>
    ))

    return (
        <View style={styles.container}>
            <TopBar />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ rowGap: 30 }}>

                <View style={{ flexDirection: "column", rowGap: 20 }}>
                    <Text style={styles.filterTitle}>Filters:</Text>
                    <ModalSelectionTransactionTypes choices={Object.values(TransactionType) as TransactionType[]} value={selectedType} setValue={setSelectedType} />
                    {selectedType === TransactionType.EXPENSE && (
                        <ModalSelectionExpenseCategories choices={categories} value={selectedCategory} setValue={setSelectedCategory} />
                    )}
                    <DateInputField date={filterStartDate} setDate={setFilterStartDate} placeholder='Start Date' />
                    <DateInputField date={filterEndDate} setDate={setFilterEndDate} placeholder='End Date' />
                </View>

                <View style={{ rowGap: 30 }}>
                    {transactionDisplayElements.length > 0 ? transactionDisplayElements :
                        <View style={styles.messageContainer}>
                            <Text style={styles.message}>There are currently no transactions.</Text>
                            <Link href="/addRecurringExpensePage" replace>
                                <Text style={styles.linkText}>Add a recurring expense</Text>
                            </Link>
                        </View>
                    }
                </View>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
        rowGap: 30,
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
    },
    linkText: {
        fontSize: 16,
        color: "#007BFF",
        textDecorationLine: "underline",
    },
    messageContainer: {
        alignItems: "center",
        rowGap: 10,
    },
    message: {
        textAlign: "center",
        fontSize: 16,
    }
})
