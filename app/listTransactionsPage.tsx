import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import Income from '@/models/Income';
import Expense from '@/models/Expense';
import User from '@/models/User';
import ExpenseCategory from '@/models/ExpenseCategory';
import uuid from 'react-native-uuid';
import Transaction from '@/models/Transaction';


export default function ViewTransactionsList() {

    setPageTitle("Transactions")
    const router = useRouter()

    const [selectedType, setSelectedType] = useState<string>("")
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")


    const handleTransactionClick = (transaction: Transaction) => {
        router.push(transaction.getPageURL())
    }

    // This is filler data. Remove once app fully working.
    const user = new User("", "")
    const transactions = [
        new Expense(user, "Expense Name", -25.5, new Date(), "", new ExpenseCategory(user, "Food", 1000)),
        new Income(user, "Income Name", 1250, new Date(), ""),
        new Expense(user, "Expense Name", -25.5, new Date(), "", new ExpenseCategory(user, "Travel", 1000)),
    ]

    


    let transactionDisplayElements = []

    for (let transaction of transactions) {
        transactionDisplayElements.push(
            <TouchableOpacity key={uuid.v4()} onPress={() => handleTransactionClick(transaction)}>
                {transaction.getListItemDisplay()}
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