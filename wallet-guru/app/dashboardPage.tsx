import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';
import ExpenseCategoryItem from '@/components/listItems/expenseCategoryItem';
import ExpenseItem from '@/components/listItems/expenseItem';
import IncomeItem from '@/components/listItems/incomeItem';
import clearRouterHistory from '@/utils/clearRouterHistory';
import getToken from '@/utils/tokenAccess/getToken';
import ExpenseCategory from '@/models/core/ExpenseCategory';
import Expense from '@/models/core/Expense';
import Income from '@/models/core/Income'
import getExpenses from '@/utils/apiCalls/getExpenses';
import getIncomes from '@/utils/apiCalls/getIncomes';
import getExpenseCategories from '@/utils/apiCalls/getExpenseCategories';
import calculateTransactionsTotalForTimeWindow from '@/utils/calculateTransactionsTotalForTimeWindow';
import getStartOfMonth from '@/utils/getStartOfMonth';
import getEndOfMonth from '@/utils/getEndOfMonth';
import filterExpensesByCategory from '@/utils/filterExpensesByCategory';
import MonthlySpendingDisplay from '@/components/widgets/MonthlySpendingDisplay';
import Transaction from '@/models/core/Transaction';
import sortTransactionsByDate from '@/utils/sortTransactionsByDate';


export default function Dashboard() {
    setPageTitle("Dashboard");

    const [token, setToken] = useState<string>('');
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [incomeTotal, setIncomeTotal] = useState<number>(0);
    const [expenseTotal, setExpenseTotal] = useState<number>(0);
    const router = useRouter();

    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to access this page.');
            clearRouterHistory(router);
            router.replace("/loginPage");
            return;
        }

        setToken(data.token);
    });

    useEffect(() => {
        async function getExpenseList() {
            const result = await getExpenses(token);
            if (result) {
                setExpenses(result);
                setExpenseTotal(calculateTransactionsTotalForTimeWindow(result, getStartOfMonth(new Date()), getEndOfMonth(new Date())));
            } else {
                console.log("Error with getting expense list")
            }
        }

        getExpenseList();
    }, [token]);

    useEffect(() => {
        async function getIncomesList() {
            const result = await getIncomes(token);
            if (result) {
                setIncomes(result);
                setIncomeTotal(calculateTransactionsTotalForTimeWindow(result, getStartOfMonth(new Date()), getEndOfMonth(new Date())))
            } else {
                console.log("Error with getting incomes list")
            }
        }

        getIncomesList();
    }, [token]);

    useEffect(() => {
        async function getCategories() {
            const result = await getExpenseCategories(token);
            if (result) {
                setCategories(result);
            } else {
                console.log("Error with getting expense categories list.")
            }
        }

        getCategories();
    }, [token, expenses]);

    const combinedTransactions = [...expenses.map(expense => ({ type: 'expense', data: expense })), ...incomes.map(income => ({ type: 'income', data: income }))];
    combinedTransactions.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
    const transactionItemsList = combinedTransactions.slice(0, 3).map(item => (
        <React.Fragment key={uuid.v4() as string}>
            {item.type === 'expense' ? (
                <ExpenseItem
                    token={token}
                    expense={item.data as Expense}
                    categoryName={
                        categories.find(cat => cat.getID() === (item.data as Expense).categoryID)?.name || ""
                    }
                    buttons
                />
            ) : (
                <IncomeItem token={token} income={item.data as Income} />
            )}
            <View style={styles.dividerLine} />
        </React.Fragment>
    ));


    const expenseCategoryItemsList = [];
    if (categories.length > 0) {
        expenseCategoryItemsList.push(
            categories.slice(0, 3).map((category) => (
                <React.Fragment key={uuid.v4() as string}>
                    <ExpenseCategoryItem token={token} currentSpending={calculateTransactionsTotalForTimeWindow(filterExpensesByCategory(expenses, category), category.recurrenceRule.startDate, category.recurrenceRule.nextTriggerDate)} category={category} />
                    <View style={styles.dividerLine} />
                </React.Fragment>
            ))
        )
    }

    return (
        <View style={styles.container}>
            <TopBar />

            <ScrollView contentContainerStyle={{ flexGrow: 1, rowGap: 50 }} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <MonthlySpendingDisplay income={incomeTotal} expenses={expenseTotal} month={new Date()} />

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Transactions:</Text>
                        <TouchableOpacity>
                            <Link href="/listTransactionsPage">
                                <Text style={styles.linkText}>View All</Text>
                            </Link>
                        </TouchableOpacity>
                    </View>
                    {transactionItemsList.length > 0 ? transactionItemsList :
                        <View style={styles.messageContainer}>
                            <Text style={styles.message}>There are currently no transactions.</Text>
                            <TouchableOpacity>
                                <Link href="/addExpensePage" replace>
                                    <Text style={styles.linkText}>Add an expense</Text>
                                </Link>
                            </TouchableOpacity>
                        </View>

                    }
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
                    {expenseCategoryItemsList.length > 0 ? expenseCategoryItemsList :
                        <View style={styles.messageContainer}>
                            <Text style={styles.message}>There are currently no expense categories. </Text>
                            <TouchableOpacity>
                                <Link href="/addExpenseCategoryPage" replace>
                                    <Text style={styles.linkText}>Add an expense category</Text>
                                </Link>
                            </TouchableOpacity>
                        </View>
                    }
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
    messageContainer: {
        alignItems: "center",
        rowGap: 10,
    },
    message: {
        textAlign: "center",
        fontSize: 16,
    }
});
