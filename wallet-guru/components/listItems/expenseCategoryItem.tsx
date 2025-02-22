import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as Progress from 'react-native-progress';
import ExpenseCategory from '@/models/ExpenseCategory';
import { useRouter } from 'expo-router';
import ListItemDeleteButton from './listItemDeleteButton';
import ListItemEditButton from './listItemEditButton';
import clearRouterHistory from '@/utils/clearRouterHistory';



interface ExpenseCategoryProps {
    category: ExpenseCategory;
    currentSpending: number
}

export default function ExpenseCategoryItem(props: ExpenseCategoryProps) {
    const router = useRouter();

    const handleEdit = (id: string) => {
        router.navigate("/editExpenseCategoryPage/" + props.category.getID());
    };

    const handleDelete = (id: string) => {
        Alert.alert('Delete Expense Category', 'Are you sure you want to delete this expense category?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    try {
                        //registry.expenseCategoryService.deleteExpenseCategory(props.category.getID());
                        // USE THE BLOCKCHAIN MIDDLEWARE API TO DELETE AN EXPENSE CATEOGRY.
                        Alert.alert('Success', 'Expense category deleted successfully!');
                        clearRouterHistory(router);
                        router.replace("/expenseCategoriesOverviewPage");
                    } catch (err: any) {
                        Alert.alert('Error', err.message);
                    }
                },
            },
        ]);
    };

    return (
        <View style={styles.categoryContainer}>
            <Text style={styles.categoryName}>{props.category.name}</Text>

            <Text style={styles.label}>Spending: £{props.currentSpending.toFixed(2)}</Text>
            <Progress.Bar
                progress={props.category.calculateBudgetUsed(props.currentSpending)}
                color={props.category.calculateBudgetUsed(props.currentSpending) < 0.8 ? "#007BFF": "#FF4C4C"}
                width={null}
            />
            <Text style={styles.label}>Budget: £{props.category.monthlyBudget.toFixed(2)}</Text>

            <View style={styles.actionsContainer}>
                <ListItemEditButton id={props.category.getID()} handleEdit={handleEdit} />
                <ListItemDeleteButton id={props.category.getID()} handleDelete={handleDelete} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    categoryContainer: {
        rowGap: 10,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 14,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
