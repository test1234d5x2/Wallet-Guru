import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';
import ExpenseCategoryItem from '@/components/listItems/expenseCategoryItem';
import Registry from '@/models/Registry';

export default function Dashboard() {

    setPageTitle("Dashboard")

    const registry = Registry.getInstance()
    const user = registry.getAuthenticatedUser()

    if (!user) {
        return null // Redirect logic can be added later if needed
    }

    const transactions = [...registry.getAllExpensesByUser(user), ...registry.getAllIncomesByUser(user)]
    const categories = registry.getAllExpenseCategoriesByUser(user)

    const transactionItemsList = []
    for (let transaction of transactions) {
        transactionItemsList.push(transaction.getListItemDisplay())
        transactionItemsList.push(<View style={styles.dividerLine} key={uuid.v4()} />)
    }

    const expenseCategoryItemsList = []
    for (let expenseCategory of categories) {
        expenseCategoryItemsList.push(<ExpenseCategoryItem category={expenseCategory} key={uuid.v4()} />)
        expenseCategoryItemsList.push(<View style={styles.dividerLine} key={uuid.v4()} />)
    }

    const incomeTotal = registry.getAllIncomesByUser(user).reduce((sum, income) => sum + income.amount, 0)
    const expenseTotal = registry.getAllExpensesByUser(user).reduce((sum, expense) => sum + expense.amount, 0)

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TopBar />

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>This Month:</Text>
                    <TouchableOpacity>
                        <Link href={"/analyticsPage"}>
                            <Text style={styles.linkText}>View Analytics</Text>
                        </Link>
                    </TouchableOpacity>
                </View>
                <View style={styles.summaryContainer}>
                    <View>
                        <Text style={styles.label}>Income</Text>
                        <Text style={styles.value}>£{incomeTotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View>
                        <Text style={styles.label}>Spending</Text>
                        <Text style={styles.value}>£{expenseTotal.toFixed(2)}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Transactions:</Text>
                    <TouchableOpacity>
                        <Link href={"/listTransactionsPage"}>
                            <Text style={styles.linkText}>View All</Text>
                        </Link>
                    </TouchableOpacity>
                </View>
                {transactionItemsList}
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Budget Overview:</Text>
                    <TouchableOpacity>
                        <Link href={"/expenseCategoriesOverviewPage"}>
                            <Text style={styles.linkText}>View</Text>
                        </Link>
                    </TouchableOpacity>
                </View>
                {expenseCategoryItemsList}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        rowGap: 50,
        flexGrow: 1,
    },
    summaryContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        fontSize: 16,
        color: "#555",
    },
    value: {
        fontSize: 18,
        fontWeight: "bold",
    },
    divider: {
        width: 1,
        backgroundColor: "#ccc",
        height: "100%",
    },
    section: {
        rowGap: 15,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    linkText: {
        fontSize: 16,
        color: "#007BFF",
        textDecorationLine: "underline",
    },
    transaction: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    transactionName: {
        fontSize: 16,
        color: "#555",
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#555",
    },
    dividerLine: {
        height: 1,
        backgroundColor: "#ccc",
    },
    progressContainer: {
        flexDirection: "column",
        rowGap: 5,
    },
    progressTextContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    budgetLabel: {
        fontSize: 16,
    },
    budgetPercentage: {
        fontSize: 16,
    },
});
