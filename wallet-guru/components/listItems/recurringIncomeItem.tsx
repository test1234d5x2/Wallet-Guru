import React from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import ListItemEditButton from './listItemEditButton'
import ListItemDeleteButton from './listItemDeleteButton'
import clearRouterHistory from '@/utils/clearRouterHistory'
import RecurringIncome from '@/models/recurrenceModels/RecurringIncome'
import deleteRecurringIncome from '@/utils/apiCalls/deleteRecurringIncome'
import { Pill } from './categoryDisplayPills'


interface RecurringIncomeItemProps {
    recurringIncome: RecurringIncome
    token: string
    categoryName: string
    categoryColour: string
}

export default function RecurringIncomeItem(props: RecurringIncomeItemProps) {

    const router = useRouter()

    const handleEdit = (id: string) => {
        router.navigate(props.recurringIncome.getEditURL())
        return
    }

    const handleDeleteTransaction = (id: string) => {
        Alert.alert('Delete Recurring Income', 'Are you sure you want to delete this recurring income source?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: () => {
                    deleteRecurringIncome(props.token, id).then((complete) => {
                        if (complete) {
                            Alert.alert('Success', 'Recurring income deleted successfully!')
                            clearRouterHistory(router)
                            router.replace("/listRecurringTransactionsPage")
                        }
                    }).catch((err: Error) => {
                        Alert.alert("Failed", "Failed to delete recurring income.")
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
                    <Text style={styles.transactionName}>{props.recurringIncome.title}</Text>
                    <Pill colour={props.categoryColour} text={props.categoryName} />
                </View>
                <Text style={[styles.transactionAmount, styles.incomeAmount]}>
                    +£{Math.abs(props.recurringIncome.amount).toFixed(2)}
                </Text>
            </View>


            <View style={styles.actionsContainer}>
                <ListItemEditButton id={props.recurringIncome.getID()} handleEdit={handleEdit} />
                <ListItemDeleteButton id={props.recurringIncome.getID()} handleDelete={handleDeleteTransaction} />
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