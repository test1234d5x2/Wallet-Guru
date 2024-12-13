import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import Expense from '@/models/Expense';
import ExpenseCategory from '@/models/ExpenseCategory';
import Income from '@/models/Income';
import User from '@/models/User';
import uuid from 'react-native-uuid';
import ExpenseCategoryItem from '@/components/listItems/expenseCategoryItem';



export default function Dashboard() {

    setPageTitle("Dashboard")

    // This is filler data. Remove once app fully working.
    const user = new User("", "")
    const transactions = [
        new Expense(user, "Expense Name", -25.5, new Date(), "", new ExpenseCategory(user, "Food", 250, 1000)),
        new Income(user, "Income Name", 1250, new Date(), ""),
        new Expense(user, "Expense Name", -25.5, new Date(), "", new ExpenseCategory(user, "Travel", 500, 1000)),
    ]

    const categories = [
        new ExpenseCategory(user, "Category Name", 400, 1000),
        new ExpenseCategory(user, "Category Name", 400, 1000),
    ]


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
                        <Text style={styles.value}>£1000.00</Text>
                    </View>
                    <View style={styles.divider} />
                    <View>
                        <Text style={styles.label}>Spending</Text>
                        <Text style={styles.value}>£750.00</Text>
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