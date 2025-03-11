import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Alert, ScrollView, Text, TouchableOpacity, StatusBar } from 'react-native'
import setPageTitle from '@/components/pageTitle/setPageTitle'
import TopBar from '@/components/topBars/topBar'
import uuid from 'react-native-uuid'
import ExpenseCategoryItem from '@/components/listItems/expenseCategoryItem'
import { Link, useRouter } from 'expo-router'
import clearRouterHistory from '@/utils/clearRouterHistory'
import ExpenseCategory from '@/models/core/ExpenseCategory'
import Expense from '@/models/core/Expense'
import getExpenseCategories from '@/utils/apiCalls/getExpenseCategories'
import getExpenses from '@/utils/apiCalls/getExpenses'
import getToken from '@/utils/tokenAccess/getToken'
import filterExpensesByCategory from '@/utils/filterExpensesByCategory'
import calculateTransactionsTotalForTimeWindow from '@/utils/calculateTransactionsTotalForTimeWindow'

export default function ViewExpenseCategories() {
    setPageTitle("Expense Categories")

    const router = useRouter()
    const [token, setToken] = useState<string>('')
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [categories, setCategories] = useState<ExpenseCategory[]>([])

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
            } else {
                console.log("Error with getting expense categories list")
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
                console.log("Error with getting expense list")
            }
        }

        getExpenseList()
    }, [token, categories])

    const displayElements = [
        ...categories.map((category) => (
            <React.Fragment key={uuid.v4()}>
                <ExpenseCategoryItem 
                    token={token} 
                    currentSpending={calculateTransactionsTotalForTimeWindow(
                        filterExpensesByCategory(expenses, category), 
                        category.recurrenceRule.startDate, 
                        category.recurrenceRule.nextTriggerDate
                    )} 
                    category={category} 
                />
                <View style={styles.divider} />
            </React.Fragment>
        ))
    ]

    return (
        <View style={styles.container}>
            <StatusBar barStyle={"dark-content"} />
            <TopBar />
            <ScrollView contentContainerStyle={{ rowGap: 20 }} showsVerticalScrollIndicator={false}>
                {displayElements.length > 0 ? displayElements :
                    <View style={styles.messageContainer}>
                        <Text style={styles.message}>There are currently no expense categories </Text>
                        <TouchableOpacity>
                            <Link href="/addExpenseCategoryPage" replace>
                                <Text style={styles.linkText}>Add an expense category</Text>
                            </Link>
                        </TouchableOpacity>
                    </View>
                }
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
    divider: {
        height: 1,
        backgroundColor: "#ccc",
    },
    message: {
        textAlign: "center",
        fontSize: 16,
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
})
