import React from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import ListItemEditButton from './listItemEditButton'
import ListItemDeleteButton from './listItemDeleteButton'
import clearRouterHistory from '@/utils/clearRouterHistory'
import RecurringExpense from '@/models/recurrenceModels/RecurringExpense'
import deleteRecurringExpense from '@/utils/apiCalls/deleteRecurringExpense'
import { Pill } from './categoryDisplayPills'


interface RecurringExpenseItemProps {
    recurringExpense: RecurringExpense
    token: string
    categoryName: string
    categoryColour: string
}

export default function RecurringExpenseItem(props: RecurringExpenseItemProps) {

    const router = useRouter()

    const handleEdit = (id: string) => {
        router.navigate(props.recurringExpense.getEditURL())
        return
    }

    const handleDeleteTransaction = (id: string) => {
        Alert.alert('Delete Recurring Expense', 'Are you sure you want to delete this recurring expense?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: () => {
                    deleteRecurringExpense(props.token, id).then((complete) => {
                        if (complete) {
                            Alert.alert('Success', 'Recurring expense deleted successfully!')
                            clearRouterHistory(router)
                            router.replace("/listRecurringTransactionsPage")
                        }
                    }).catch((err: Error) => {
                        Alert.alert("Failed", "Failed to delete recurring expense.")
                        console.log(err.message)
                    })
                }
            },
        ])
    }

    return (
        <View style={styles.transactionContainer}>
            <View style={styles.transactionTextContainer}>
                <View>
                    <Text style={styles.transactionName}>{props.recurringExpense.title}</Text>
                    <Pill colour={props.categoryColour} text={props.categoryName} />
                </View>
                <Text style={[styles.transactionAmount, styles.expenseAmount]}>
                    -£{Math.abs(props.recurringExpense.amount).toFixed(2)}
                </Text>
            </View>


            <View style={styles.actionsContainer}>
                <ListItemEditButton id={props.recurringExpense.getID()} handleEdit={handleEdit} />
                <ListItemDeleteButton id={props.recurringExpense.getID()} handleDelete={handleDeleteTransaction} />
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
