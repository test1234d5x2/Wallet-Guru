import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuid4, v1 } from 'uuid';


export default function ViewTransactionsList() {

    setPageTitle("Transactions")

    const [selectedType, setSelectedType] = useState<string>("")
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("")

    const transactions = [
        { id: "1", name: "Expense Name", category: "Food", amount: -25.5, type: "Expense" },
        { id: "2", name: "Income Name", category: "", amount: 1250, type: "Income" },
        { id: "3", name: "Expense Name", category: "Food", amount: -25.5, type: "Expense" },
    ]

    const handleEditTransaction = (id: string) => {
        console.log(`Edit transaction with ID: ${id}`);
    }

    const handleDeleteTransaction = (id: string) => {
        console.log(`Delete transaction with ID: ${id}`);
    }


    let transactionDisplayElements = []

    for (let transaction of transactions) {
        transactionDisplayElements.push(
            <View key={transaction.id} style={styles.transactionContainer}>
                <View style={styles.transactionTextContainer}>
                    <View>
                        <Text style={styles.transactionName}>{transaction.name}</Text>
                        {transaction.type === "Expense" ? <Text style={styles.transactionCategory}>Category: {transaction.category}</Text>: null}
                    </View>
                    <Text style={[styles.transactionAmount, transaction.amount < 0 ? styles.expenseAmount : styles.incomeAmount,]}>
                        {transaction.amount < 0 ? "-" : "+"}£{Math.abs(transaction.amount)}
                    </Text>
                </View>
                

                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEditTransaction(transaction.id)}>
                        <Ionicons name="pencil-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTransaction(transaction.id)}>
                        <Ionicons name="trash-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        )

        transactionDisplayElements.push(<View style={styles.divider} key={Math.random().toString()} />)
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
    transactionContainer: {
        rowGap: 15,
    },
    transactionTextContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    transactionName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    transactionCategory: {
        fontSize: 14,
        color: "#555",
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: "bold",
    },
    expenseAmount: {
        color: "#FF4C4C",
    },
    incomeAmount: {
        color: "#007BFF",
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    editButton: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        width: 50,
        alignItems: "center",
    },
    deleteButton: {
        backgroundColor: "#FF4C4C",
        padding: 10,
        borderRadius: 5,
        width: 50,
        alignItems: "center",
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
    },

})