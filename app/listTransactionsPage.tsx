import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';
import Registry from '@/models/Registry';
import ExpenseItem from '@/components/listItems/expenseItem';
import Transaction from '@/models/Transaction';
import IncomeItem from '@/components/listItems/incomeItem';
import clearRouterHistory from '@/utils/clearRouterHistory';

export default function ViewTransactionsList() {

    setPageTitle("Transactions")
    const router = useRouter()

    const [selectedType, setSelectedType] = useState<string>("")
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")

    const registry = Registry.getInstance()
    const user = registry.getAuthenticatedUser()

    if (!user) {
        clearRouterHistory(router);
        router.replace("/loginPage");
        return;
    }

    const expenses = [
        ...registry.getAllExpensesByUser(user),
    ]

    const incomes = [
        ...registry.getAllIncomesByUser(user)
    ]

    const handleTransactionClick = (transaction: Transaction) => {
        router.push(transaction.getPageURL());
        return;
    }

    let transactionDisplayElements = []

    for (let expense of expenses) {
        transactionDisplayElements.push(
            <TouchableOpacity key={uuid.v4()} onPress={() => handleTransactionClick(expense)}>
                <ExpenseItem registry={registry} expense={expense} key={uuid.v4()} />
            </TouchableOpacity>
        )
        transactionDisplayElements.push(<View style={styles.divider} key={uuid.v4()} />)
    }

    for (let income of incomes) {
        transactionDisplayElements.push(
            <TouchableOpacity key={uuid.v4()} onPress={() => handleTransactionClick(income)}>
                <IncomeItem registry={registry} income={income} key={uuid.v4()} />
            </TouchableOpacity>
        )
        transactionDisplayElements.push(<View style={styles.divider} key={uuid.v4()} />)
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TopBar />

            <View style={styles.filtersContainer}>
                <Text style={styles.filterTitle}>Filters:</Text>
            </View>

            {transactionDisplayElements}
        </ScrollView>
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
    filtersContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
    },
})
