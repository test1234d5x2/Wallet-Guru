import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';
import Registry from '@/models/data/Registry';
import ExpenseItem from '@/components/listItems/expenseItem';
import Transaction from '@/models/Transaction';
import IncomeItem from '@/components/listItems/incomeItem';
import clearRouterHistory from '@/utils/clearRouterHistory';

export default function ViewTransactionsList() {
    setPageTitle("Transactions");

    const router = useRouter();
    const [selectedType, setSelectedType] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const registry = Registry.getInstance();
    const authService = registry.authService;
    const expenseService = registry.expenseService;
    const incomeService = registry.incomeService;

    const user = authService.getAuthenticatedUser();

    if (!user) {
        clearRouterHistory(router);
        router.replace("/loginPage");
        return;
    }

    const expenses = expenseService.getAllExpensesByUser(user);
    const incomes = incomeService.getAllIncomesByUser(user);

    const handleTransactionClick = (transaction: Transaction) => {
        router.push(transaction.getPageURL());
    };

    const transactionDisplayElements = [
        ...expenses.map((expense) => (
            <React.Fragment key={uuid.v4() as string}>
                <TouchableOpacity onPress={() => handleTransactionClick(expense)}>
                    <ExpenseItem registry={registry} expense={expense} />
                </TouchableOpacity>
                <View style={styles.divider} />
            </React.Fragment>
        )),
        ...incomes.map((income) => (
            <React.Fragment key={uuid.v4() as string}>
                <TouchableOpacity onPress={() => handleTransactionClick(income)}>
                    <IncomeItem registry={registry} income={income} />
                </TouchableOpacity>
                <View style={styles.divider} />
            </React.Fragment>
        )),
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TopBar />

            <View style={styles.filtersContainer}>
                <Text style={styles.filterTitle}>Filters:</Text>
            </View>

            {transactionDisplayElements}
        </ScrollView>
    );
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
    divider: {
        height: 1,
        backgroundColor: "#ccc",
    },
});
