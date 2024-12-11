import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as Progress from 'react-native-progress';
import ExpenseCategory from '@/models/ExpenseCategory';
import { useRouter } from 'expo-router';
import ListItemDeleteButton from './listItemDeleteButton';
import ListItemEditButton from './listItemEditButton';


interface ExpenseCategoryProps {
    category: ExpenseCategory
}


export default function ExpenseCategoryItem(props: ExpenseCategoryProps) {

    const router = useRouter()

    const handleEdit = (id: string) => {
        router.navigate("/editExpenseCategoryPage")
        return
    }
    const handleDelete = (id: string) => {
        Alert.alert('Delete Expense Category', 'Are you sure you want to delete this expense category?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
                console.log('Expense category deleted')
                router.replace("/expenseCategoriesOverviewPage")
            } },
        ])
    }

    return (
        <View style={styles.categoryContainer}>
            <Text style={styles.categoryName}>{props.category.name}</Text>

            <Text style={styles.label}>Spending: £{props.category.currentMonthlySpending}</Text>
            <Progress.Bar progress={props.category.calculateBudgetUsed()} color="#007BFF" width={null} />
            <Text style={styles.label}>Budget: £{props.category.monthlyBudget}</Text>

            <View style={styles.actionsContainer}>
                <ListItemEditButton id={props.category.getID()} handleEdit={handleEdit} />
                <ListItemDeleteButton id={props.category.getID()} handleDelete={handleDelete} />
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
})