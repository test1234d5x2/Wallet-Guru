import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Income from '@/models/Income';

interface IncomeItemProps {
    income: Income
}

export default function IncomeItem(props: IncomeItemProps) {

    const handleEditTransaction = (id: string) => {
        console.log(`Edit transaction with ID: ${id}`)
    }

    const handleDeleteTransaction = (id: string) => {
        console.log(`Delete transaction with ID: ${id}`)
    }

    return (
        <View key={props.income.id} style={styles.transactionContainer}>
            <View style={styles.transactionTextContainer}>
                <View>
                    <Text style={styles.transactionName}>{props.income.title}</Text>
                </View>
                <Text style={[styles.transactionAmount, styles.incomeAmount]}>
                    {props.income.amount < 0 ? "-" : "+"}£{Math.abs(props.income.amount)}
                </Text>
            </View>
            

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditTransaction(props.income.id)}>
                    <Ionicons name="pencil-outline" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTransaction(props.income.id)}>
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