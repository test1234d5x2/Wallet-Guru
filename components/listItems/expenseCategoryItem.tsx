import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';
import ExpenseCategory from '@/models/ExpenseCategory';


interface ExpenseCategoryProps {
    category: ExpenseCategory
}


export default function ExpenseCategoryItem(props: ExpenseCategoryProps) {

    const handleEdit = (id: string) => {
        console.log(`Edit category with ID: ${id}`)
    }
    const handleDelete = (id: string) => {
        console.log(`Delete category with ID: ${id}`)
    }

    return (
        <View style={styles.categoryContainer}>
            <Text style={styles.categoryName}>{props.category.name}</Text>

            <Text style={styles.label}>Spending: £{props.category.currentMonthlySpending}</Text>
            <Progress.Bar progress={props.category.calculateBudgetUsed()} color="#007BFF" width={null} />
            <Text style={styles.label}>Budget: £{props.category.monthlyBudget}</Text>

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(props.category.id)}>
                    <Ionicons name="pencil-outline" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(props.category.id)}>
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    )
}




const styles = StyleSheet.create({
    categoryContainer: {
        rowGap: 10,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    label: {
        fontSize: 14,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    editButton: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    deleteButton: {
        backgroundColor: "#FF4C4C",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
})