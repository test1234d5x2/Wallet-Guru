import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Expense from '@/models/Expense';

interface ExpenseItemProps {
    expense: Expense
}

export default function ExpenseItem(props: ExpenseItemProps) {

    const handleEditTransaction = (id: string) => {
        console.log(`Edit transaction with ID: ${id}`)
    }

    const handleDeleteTransaction = (id: string) => {
        console.log(`Delete transaction with ID: ${id}`)
    }

    return (
        <View key={props.expense.id} style={styles.transactionContainer}>
            <View style={styles.transactionTextContainer}>
                <View>
                    <Text style={styles.transactionName}>{props.expense.title}</Text>
                    <Text style={styles.transactionCategory}>Category: {props.expense.expenseCategory.name}</Text>
                </View>
                <Text style={[styles.transactionAmount, styles.expenseAmount]}>
                    {props.expense.amount < 0 ? "-" : "+"}£{Math.abs(props.expense.amount)}
                </Text>
            </View>
            

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditTransaction(props.expense.id)}>
                    <Ionicons name="pencil-outline" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTransaction(props.expense.id)}>
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
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
})