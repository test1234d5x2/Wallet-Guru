import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import Income from '@/models/Income';
import Expense from '@/models/Expense';
import User from '@/models/User';
import ExpenseCategory from '@/models/ExpenseCategory';
import ExpenseItem from '@/components/listItems/expenseItem';
import IncomeItem from '@/components/listItems/incomeItem';
import uuid from 'react-native-uuid';


export default function ViewTransactionsList() {

    setPageTitle("Transactions")

    const [selectedType, setSelectedType] = useState<string>("")
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("")

    const transactions = [
        { data: new Expense(new User("", ""), "Expense Name", -25.5, new Date(), "", new ExpenseCategory("Food", 250)) },
        { data: new Income(new User("", ""), "Income Name", 1250, new Date(), "") },
        { data: new Expense(new User("", ""), "Expense Name", -25.5, new Date(), "", new ExpenseCategory("Food", 250)) },
    ]

    


    let transactionDisplayElements = []

    for (let transaction of transactions) {
        transactionDisplayElements.push(transaction.data instanceof Expense ? <ExpenseItem key={uuid.v4()} expense={transaction.data} /> : <IncomeItem key={uuid.v4()} income={transaction.data} /> )
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