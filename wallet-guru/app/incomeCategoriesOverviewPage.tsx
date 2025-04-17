import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Alert, ScrollView, Text, TouchableOpacity, StatusBar } from 'react-native'
import setPageTitle from '@/components/pageTitle/setPageTitle'
import TopBar from '@/components/topBars/topBar'
import uuid from 'react-native-uuid'
import IncomeCategoryItem from '@/components/listItems/incomeCategoryItem'
import { Link, useRouter } from 'expo-router'
import clearRouterHistory from '@/utils/clearRouterHistory'
import IncomeCategory from '@/models/core/IncomeCategory'
import Income from '@/models/core/Income'
import getIncomeCategories from '@/utils/apiCalls/getIncomeCategories'
import getIncomes from '@/utils/apiCalls/getIncomes'
import getToken from '@/utils/tokenAccess/getToken'

export default function ViewIncomeCategories() {
    setPageTitle('Income Categories')

    const router = useRouter()
    const [token, setToken] = useState<string>('')
    const [incomes, setIncomes] = useState<Income[]>([])
    const [categories, setCategories] = useState<IncomeCategory[]>([])

    useEffect(() => {
        getToken().then((data) => {
            if (!data) {
                Alert.alert('Error', 'You must be logged in to access this page')
                clearRouterHistory(router)
                router.replace('/loginPage')
                return
            }
            setToken(data.token)
        })
    }, [])

    useEffect(() => {
        if (!token) return
        async function fetchCategories() {
            const result = await getIncomeCategories(token)
            if (result) setCategories(result)
            else console.log('Error fetching income categories')
        }
        fetchCategories()
    }, [token])

    useEffect(() => {
        if (!token) return
        async function fetchIncomes() {
            const result = await getIncomes(token)
            if (result) setIncomes(result)
            else console.log('Error fetching incomes')
        }
        fetchIncomes()
    }, [token, categories])

    const displayElements = categories.map((category) => {
        return (
            <React.Fragment key={uuid.v4()}>
                <IncomeCategoryItem token={token} category={category} />
                <View style={styles.divider} />
            </React.Fragment>
        )
    })

    return (
        <View style={styles.container}>
            <StatusBar barStyle={'dark-content'} />
            <TopBar />
            <ScrollView contentContainerStyle={{ rowGap: 20 }} showsVerticalScrollIndicator={false}>
                {displayElements.length > 0 ? displayElements : (
                    <View style={styles.messageContainer}>
                        <Text style={styles.message}>There are currently no income categories</Text>
                        <TouchableOpacity>
                            <Link href="/addIncomeCategoryPage" replace>
                                <Text style={styles.linkText}>Add an income category</Text>
                            </Link>
                        </TouchableOpacity>
                    </View>
                )}
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
        backgroundColor: '#ccc',
    },
    message: {
        textAlign: 'center',
        fontSize: 16,
    },
    linkText: {
        fontSize: 16,
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
    messageContainer: {
        alignItems: 'center',
        rowGap: 10,
    },
})
