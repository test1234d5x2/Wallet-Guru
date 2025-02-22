import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Expense from '@/models/Expense';
import { useRouter } from 'expo-router';
import ListItemEditButton from './listItemEditButton';
import ListItemDeleteButton from './listItemDeleteButton';
import clearRouterHistory from '@/utils/clearRouterHistory';
import deleteExpense from '@/utils/apiCalls/deleteExpense';

interface ExpenseItemProps {
    expense: Expense
    token: string
}

export default function ExpenseItem(props: ExpenseItemProps) {

    const router = useRouter();

    const handleEdit = (id: string) => {
        router.navigate(props.expense.getEditURL());
        return;
    }

    const handleDeleteTransaction = (id: string) => {
        Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: () => {
                    deleteExpense(props.token, id).then((complete) => {
                        if (complete) {
                            Alert.alert('Success', 'Expense deleted successfully!');
                            clearRouterHistory(router);
                            router.replace("/listTransactionsPage");
                        }
                    }).catch((err: Error) => {
                        Alert.alert("Failed", "Failed to delete expense.");
                        console.log(err.message);
                    })
                }
            },
        ])
    }

    return (
        <View style={styles.transactionContainer}>
            <View style={styles.transactionTextContainer}>
                <View>
                    <Text style={styles.transactionName}>{props.expense.title}</Text>
                    <Text style={styles.transactionCategory}>Category: {//props.expense.expenseCategory.name
                    }</Text>
                </View>
                <Text style={[styles.transactionAmount, styles.expenseAmount]}>
                    {props.expense.amount < 0 ? "-" : "+"}£{Math.abs(props.expense.amount).toFixed(2)}
                </Text>
            </View>


            <View style={styles.actionsContainer}>
                <ListItemEditButton id={props.expense.getID()} handleEdit={handleEdit} />
                <ListItemDeleteButton id={props.expense.getID()} handleDelete={handleDeleteTransaction} />
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
