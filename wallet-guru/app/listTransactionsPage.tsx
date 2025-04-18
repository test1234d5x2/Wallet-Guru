import React, { useEffect, useState } from 'react'
import { Link, useRouter } from 'expo-router'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native'
import setPageTitle from '@/components/pageTitle/setPageTitle'
import TopBar from '@/components/topBars/topBar'
import uuid from 'react-native-uuid'
import ExpenseItem from '@/components/listItems/expenseItem'
import Transaction from '@/models/core/Transaction'
import IncomeItem from '@/components/listItems/incomeItem'
import clearRouterHistory from '@/utils/clearRouterHistory'
import ExpenseCategory from '@/models/core/ExpenseCategory'
import DateInputField from '@/components/formComponents/inputFields/dateInputField'
import { ModalSelectionExpenseCategories } from '@/components/modalSelection/modalSelectionCategories'
import ModalSelectionTransactionTypes from '@/components/modalSelection/modalSelectionTransactionTypes'
import TransactionType from '@/enums/TransactionType'
import filterExpensesByCategory from '@/utils/filterExpensesByCategory'
import Expense from '@/models/core/Expense'
import Income from '@/models/core/Income'
import getExpenseCategories from '@/utils/apiCalls/getExpenseCategories'
import getExpenses from '@/utils/apiCalls/getExpenses'
import getIncomes from '@/utils/apiCalls/getIncomes'
import getToken from '@/utils/tokenAccess/getToken'
import filterTransactionsByTimeWindow from '@/utils/filterTransactionsByTimeWindow'
import updateCategoriesTimeWindowEnd from '@/utils/analytics/batchProcessRecurrencesUpdates/updateCategoriesTimeWindowEnd'
import IncomeCategory from '@/models/core/IncomeCategory'

export default function ViewTransactionsList() {
    setPageTitle('Transactions')

    const router = useRouter()
    const [token, setToken] = useState<string>('')
    const [selectedType, setSelectedType] = useState<TransactionType | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null)
    const [filterStartDate, setFilterStartDate] = useState<Date | null>(null)
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(null)
    const [categories, setCategories] = useState<ExpenseCategory[]>([])
    const [incomeCategories, setIncomeCategories] = useState<IncomeCategory[]>([])
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [incomes, setIncomes] = useState<Income[]>([])

    useEffect(() => {
        const fetchToken = async () => {
            const data = await getToken()
            if (!data) {
                Alert.alert('Error', 'You must be logged in to access this page.')
                clearRouterHistory(router)
                router.replace('/loginPage')
                return
            }
            setToken(data.token)
        }

        fetchToken()
    }, [])

    useEffect(() => {
        async function getCategories() {
            const result = await getExpenseCategories(token)
            if (result) {
                setCategories(result)
                await updateCategoriesTimeWindowEnd(result, token)
            } else {
                console.log('Error with getting expense categories list')
            }
        }

        getCategories()
    }, [token])

    useEffect(() => {
        async function getExpenseList() {
            const result = await getExpenses(token)
            if (result) {
                setExpenses(result)
            } else {
                console.log('Error with getting expenses list')
            }
        }

        getExpenseList()
    }, [token])

    useEffect(() => {
        async function getIncomesList() {
            const result = await getIncomes(token)
            if (result) {
                setIncomes(result)
            } else {
                console.log('Error with getting incomes list')
            }
        }

        getIncomesList()
    }, [token])

    const handleTransactionClick = (transaction: Transaction) => {
        clearRouterHistory(router)
        router.navigate(transaction.getPageURL())
    }

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const combinedTransactions: { type: string; data: Transaction | Expense | Income }[] = []

    if (selectedType !== TransactionType.EXPENSE) {
        const filteredIncomes = filterTransactionsByTimeWindow(
            incomes,
            filterStartDate || new Date(1800, 0, 1),
            filterEndDate || tomorrow
        )
        combinedTransactions.push(...filteredIncomes.map(income => ({ type: 'income', data: income })))
    }

    if (selectedType !== TransactionType.INCOME) {
        let filteredExpenses = filterTransactionsByTimeWindow(
            expenses,
            filterStartDate || new Date(1800, 0, 1),
            filterEndDate || tomorrow
        )
        if (selectedCategory) {
            filteredExpenses = filterExpensesByCategory(filteredExpenses, selectedCategory)
        }
        combinedTransactions.push(...filteredExpenses.map(expense => ({ type: 'expense', data: expense })))
    }

    combinedTransactions.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

    const transactionDisplayElements = combinedTransactions.map(item => {
        let displayItem

        if (item.type === "income") {
            displayItem = <IncomeItem 
                token={token}
                income={item.data as Income}
                categoryColour={incomeCategories.find(cat => cat.getID() === (item.data as Income).categoryID)?.colour || ''}
                categoryName={incomeCategories.find(cat => cat.getID() === (item.data as Expense).categoryID)?.name || ''}
                buttons
            />
        }

        else {
            displayItem = <ExpenseItem
                token={token}
                expense={item.data as Expense}
                categoryColour={categories.find(cat => cat.getID() === (item.data as Expense).categoryID)?.colour || ''}
                categoryName={categories.find(cat => cat.getID() === (item.data as Expense).categoryID)?.name || ''}
                buttons
            />
        }

        return (
            <React.Fragment key={uuid.v4() as string}>
                <TouchableOpacity onPress={() => handleTransactionClick(item.data)}>
                    {displayItem}
                </TouchableOpacity>
                <View style={styles.divider} />
            </React.Fragment>
        )
    })

    return (
        <View style={styles.container}>
            <TopBar />
            <StatusBar barStyle={'dark-content'} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ rowGap: 30 }}>
                <View style={{ flexDirection: 'column', rowGap: 20 }}>
                    <Text style={styles.filterTitle}>Filters:</Text>
                    <ModalSelectionTransactionTypes
                        choices={Object.values(TransactionType) as TransactionType[]}
                        value={selectedType}
                        setValue={setSelectedType}
                    />
                    {selectedType === TransactionType.EXPENSE && (
                        <ModalSelectionExpenseCategories
                            choices={categories}
                            value={selectedCategory}
                            setValue={setSelectedCategory}
                        />
                    )}
                    <DateInputField date={filterStartDate} setDate={setFilterStartDate} placeholder='Start Date' />
                    <DateInputField date={filterEndDate} setDate={setFilterEndDate} placeholder='End Date' />
                </View>

                <View style={{ rowGap: 30 }}>
                    {transactionDisplayElements.length > 0 ? (
                        transactionDisplayElements
                    ) : (
                        <View style={styles.messageContainer}>
                            <Text style={styles.message}>There are currently no transactions.</Text>
                            <Link href="/addExpensePage" replace>
                                <Text style={styles.linkText}>Add an expense</Text>
                            </Link>
                        </View>
                    )}
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
        rowGap: 30
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc'
    },
    linkText: {
        fontSize: 16,
        color: '#007BFF',
        textDecorationLine: 'underline'
    },
    messageContainer: {
        alignItems: 'center',
        rowGap: 10
    },
    message: {
        textAlign: 'center',
        fontSize: 16
    }
})
