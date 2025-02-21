import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';
//import ExpenseCategoryItem from '@/components/listItems/expenseCategoryItem';
import ExpenseItem from '@/components/listItems/expenseItem';
import IncomeItem from '@/components/listItems/incomeItem';
import clearRouterHistory from '@/utils/clearRouterHistory';
import getToken from '@/utils/tokenAccess/getToken';
import ExpenseCategory from '@/models/ExpenseCategory';
import Expense from '@/models/Expense';
import Income from '@/models/Income';
import calculateMonthlyTransactionsTotal from '@/utils/calculateMonthlyTransactionsTotal';



async function getExpenseCategories(token: string): Promise<ExpenseCategory[]> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const GET_EXPENSE_CATEGORIES_URL = `http://${API_DOMAIN}/api/expense-categories`;

    const response = await fetch(GET_EXPENSE_CATEGORIES_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },

    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    const data = await response.json();
    const categories: ExpenseCategory[] = data.categories;
    return categories;
}



async function getExpenses(token: string): Promise<Expense[]> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const GET_EXPENSES_URL = `http://${API_DOMAIN}/api/expenses/`

    const response = await fetch(GET_EXPENSES_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    const data = await response.json();
    const expenses: Expense[] = data.expenses;
    return expenses;
}


async function getIncomes(token: string): Promise<Income[]> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const GET_INCOMES_URL = `http://${API_DOMAIN}/api/expenses/`

    const response = await fetch(GET_INCOMES_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    const data = await response.json();
    const incomes: Income[] = data.incomes;
    return incomes;
}



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
            Alert.alert('Error', 'You must be logged in to view your dashboard.');
            clearRouterHistory(router);
            router.replace("/loginPage");
            return;
        }

        setToken(data);
    });

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
    }, [token]);

    useEffect(() => {
        async function getExpenseList() {
            const result = await getExpenses(token);
            if (result) {
                setExpenses(result);
                setExpenseTotal(calculateMonthlyTransactionsTotal(result, new Date()));
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
                setIncomeTotal(calculateMonthlyTransactionsTotal(result, new Date()))
            } else {
                console.log("Error with getting incomes list")
            }
        }

        getIncomesList();
    }, [token]);



    const transactionItemsList = [
        ...expenses.slice(0, 3).map((expense) => (
            <React.Fragment key={uuid.v4() as string}>
                <ExpenseItem expense={expense} />
                <View style={styles.dividerLine} />
            </React.Fragment>
        )),
        ...incomes.slice(0, 3).map((income) => (
            <React.Fragment key={uuid.v4() as string}>
                <IncomeItem income={income} />
                <View style={styles.dividerLine} />
            </React.Fragment>
        )),
    ];

    // const expenseCategoryItemsList = categories.slice(0, 3).map((category) => (
    //     <React.Fragment key={uuid.v4() as string}>
    //         <ExpenseCategoryItem category={category} />
    //         <View style={styles.dividerLine} />
    //     </React.Fragment>
    // ));

    return (
        <View style={styles.container}>
            <TopBar />

            <ScrollView contentContainerStyle={{ flexGrow: 1, rowGap: 50 }} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
                    {//expenseCategoryItemsList.length > 0 ? expenseCategoryItemsList :
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
