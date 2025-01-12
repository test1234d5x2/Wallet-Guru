import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';
import ExpenseCategoryItem from '@/components/listItems/expenseCategoryItem';
import ExpenseItem from '@/components/listItems/expenseItem';
import IncomeItem from '@/components/listItems/incomeItem';
import Registry from '@/models/data/Registry';
import clearRouterHistory from '@/utils/clearRouterHistory';
import ExpenseCategory from '@/models/ExpenseCategory';

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

    for (let x = 0; x < 50; x++) {
        incomeService.addIncome(user, "", 250, new Date(), "")
        expenseService.addExpense(user, "", 25, new Date(), "", new ExpenseCategory(user, "Other", 1000))

    }

    const incomes = incomeService.getAllIncomesByUser(user);
    const expenses = expenseService.getAllExpensesByUser(user);
    const categories = categoryService.getAllCategoriesByUser(user);

    const incomeTotal = incomeService.calculateMonthlyTransactionsTotal(user, new Date());
    const expenseTotal = expenseService.calculateMonthlyTransactionsTotal(user, new Date());

    const transactionItemsList = [
        ...expenses.slice(0, 3).map((expense) => (
            <React.Fragment key={uuid.v4() as string}>
                <ExpenseItem registry={registry} expense={expense} />
                <View style={styles.dividerLine} />
            </React.Fragment>
        )),
        ...incomes.slice(0, 3).map((income) => (
            <React.Fragment key={uuid.v4() as string}>
                <IncomeItem registry={registry} income={income} />
                <View style={styles.dividerLine} />
            </React.Fragment>
        )),
    ];

    const expenseCategoryItemsList = categories.slice(0, 3).map((category) => (
        <React.Fragment key={uuid.v4() as string}>
            <ExpenseCategoryItem category={category} />
            <View style={styles.dividerLine} />
        </React.Fragment>
    ));

    return (
        <View style={styles.container}>
            <TopBar />

            <ScrollView contentContainerStyle={{ flexGrow: 1, rowGap: 50 }} style={{flex: 1}} showsVerticalScrollIndicator={false}>
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
                    {transactionItemsList.length > 0 ? transactionItemsList : <Text>There are currently no transactions.</Text>}
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
                    {expenseCategoryItemsList.length > 0 ? expenseCategoryItemsList : <Text>There are currently no expense categories.</Text>}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 50,
        backgroundColor: '#fff',
        rowGap: 50,
        flex: 1,
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
