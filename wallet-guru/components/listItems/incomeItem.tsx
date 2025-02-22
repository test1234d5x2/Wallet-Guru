import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Income from '@/models/Income';
import { useRouter } from 'expo-router';
import ListItemEditButton from './listItemEditButton';
import ListItemDeleteButton from './listItemDeleteButton';
import clearRouterHistory from '@/utils/clearRouterHistory';

interface IncomeItemProps {
    income: Income
}

export default function IncomeItem(props: IncomeItemProps) {

    const router = useRouter();

    const handleEdit = (id: string) => {
        router.navigate(props.income.getEditURL());
        return;
    }

    const handleDeleteTransaction = (id: string) => {
        Alert.alert('Delete Income', 'Are you sure you want to delete this income source?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
                // props.registry.incomeService.deleteIncome(props.income.getID());
                // USE THE BLOCKCHAIN MIDDLEWARE API TO DELETE AN INCOME
                Alert.alert('Success', 'Income deleted successfully!');
                clearRouterHistory(router);
                router.replace("/listTransactionsPage");
                return;
            } },
        ])
    }

    return (
        <View style={styles.transactionContainer}>
            <View style={styles.transactionTextContainer}>
                <View>
                    <Text style={styles.transactionName}>{props.income.title}</Text>
                </View>
                <Text style={[styles.transactionAmount, styles.incomeAmount]}>
                    {props.income.amount < 0 ? "-" : "+"}£{Math.abs(props.income.amount).toFixed(2)}
                </Text>
            </View>
            

            <View style={styles.actionsContainer}>
                <ListItemEditButton id={props.income.getID()} handleEdit={handleEdit} />
                <ListItemDeleteButton id={props.income.getID()} handleDelete={handleDeleteTransaction} />
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