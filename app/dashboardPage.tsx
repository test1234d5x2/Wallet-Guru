import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';
import ExpenseCategoryItem from '@/components/listItems/expenseCategoryItem';
import ExpenseItem from '@/components/listItems/expenseItem';
import IncomeItem from '@/components/listItems/incomeItem';
import TransactionType from '@/enums/TransactionType';
import Registry from '@/models/data/Registry';
import clearRouterHistory from '@/utils/clearRouterHistory';

export default function Dashboard() {
    setPageTitle("Dashboard");

    const router = useRouter();
    const registry = Registry.getInstance();
    const authService = registry.authService;
    const incomeService = registry.incomeService;
    const expenseService = registry.expenseService;
    const categoryService = registry.expenseCategoryService;

    const user = authService.getAuthenticatedUser();

    if (!user) {
        Alert.alert('Error', 'You must be logged in to view your dashboard.');
        clearRouterHistory(router);
        router.replace("/loginPage");
        return;
    }

    const incomes = incomeService.getAllIncomesByUser(user);
    const expenses = expenseService.getAllExpensesByUser(user);
    const categories = categoryService.getAllCategoriesByUser(user);

    const incomeTotal = incomeService.calculateMonthlyTransactionsTotal(user, new Date());
    const expenseTotal = expenseService.calculateMonthlyTransactionsTotal(user, new Date());

    const transactionItemsList = [
        ...expenses.map((expense) => (
            <React.Fragment key={uuid.v4() as string}>
                <ExpenseItem registry={registry} expense={expense} />
                <View style={styles.dividerLine} />
            </React.Fragment>
        )),
        ...incomes.map((income) => (
            <React.Fragment key={uuid.v4() as string}>
                <IncomeItem registry={registry} income={income} />
                <View style={styles.dividerLine} />
            </React.Fragment>
        )),
    ];

    const expenseCategoryItemsList = categories.map((category) => (
        <React.Fragment key={uuid.v4() as string}>
            <ExpenseCategoryItem category={category} />
            <View style={styles.dividerLine} />
        </React.Fragment>
    ));

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TopBar />

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>This Month:</Text>
                    <TouchableOpacity>
                        <Link href="/analyticsPage">
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
                        <Link href="/listTransactionsPage">
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
                        <Link href="/expenseCategoriesOverviewPage">
                            <Text style={styles.linkText}>View</Text>
                        </Link>
                    </TouchableOpacity>
                </View>
                {expenseCategoryItemsList}
            </View>
        </ScrollView>
    );
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
    dividerLine: {
        height: 1,
        backgroundColor: "#ccc",
    },
});
