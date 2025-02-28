import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { LineChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import clearRouterHistory from '@/utils/clearRouterHistory';
import getToken from '@/utils/tokenAccess/getToken';
import Expense from '@/models/core/Expense';
import getExpenses from '@/utils/apiCalls/getExpenses';
import getStartOfMonth from '@/utils/getStartOfMonth';
import getEndOfMonth from '@/utils/getEndOfMonth';
import MonthSelector from '@/components/widgets/MonthSelector';
import ExpenseItem from '@/components/listItems/expenseItem';
import ExpenseCategory from '@/models/core/ExpenseCategory';
import getExpenseCategories from '@/utils/apiCalls/getExpenseCategories';

export default function SpendTrendAndTopExpenses() {
    setPageTitle('Spend Trends & Top Expenses');

    const screenWidth = Dimensions.get('window').width;
    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [month, setMonth] = useState<Date>(new Date());

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
        async function fetchExpenses() {
            const result = await getExpenses(token);
            if (result) {
                setExpenses(result);
            } else {
                console.log("Error with getting expense list");
            }
        }
        if (token) {
            fetchExpenses();
        }
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
    }, [token]);



    const getDailySpending = (expenses: Expense[], month: Date): number[] => {
        const startOfMonth = getStartOfMonth(month);
        const endOfMonth = getEndOfMonth(month);
        const daysInMonth = endOfMonth.getDate();
        const dailyTotals = new Array(daysInMonth).fill(0);
        expenses.forEach(expense => {
            const expenseDate = new Date(expense.date);
            if (expenseDate >= startOfMonth && expenseDate <= endOfMonth) {
                const day = expenseDate.getDate();
                dailyTotals[day - 1] += expense.amount;
            }
        });
        return dailyTotals;
    };

    const getTopExpenses = (expenses: Expense[], month: Date): Expense[] => {
        const startOfMonth = getStartOfMonth(month);
        const endOfMonth = getEndOfMonth(month);
        const monthlyExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
        });
        monthlyExpenses.sort((a, b) => b.amount - a.amount);
        return monthlyExpenses.slice(0, 5);
    };

    const dailyTotals = getDailySpending(expenses, month);
    const dayLabels = dailyTotals.map((_, index) => (index + 1).toString());
    const displayedLabels = dayLabels.map((label, i) => (i % 2 === 0 ? label : ''));
    const topExpenses = getTopExpenses(expenses, month);

    const handlePrevMonth = () => {
        const newMonth = new Date(month);
        newMonth.setMonth(month.getMonth() - 1);
        setMonth(newMonth);
    };

    const handleNextMonth = () => {
        const newMonth = new Date(month);
        newMonth.setMonth(month.getMonth() + 1);
        setMonth(newMonth);
    };

    return (
        <View style={styles.container}>
            <TopBar />
            <ScrollView contentContainerStyle={styles.mainContent} showsVerticalScrollIndicator={false}>
                <View style={styles.monthSelector}>
                    <MonthSelector month={month} setMonth={setMonth} />
                </View>

                <Text style={styles.sectionHeader}>Daily Spend Trend</Text>
                {dailyTotals.every(val => val === 0) ? (
                    <Text style={styles.message}>No expenses recorded for this month.</Text>
                ) : (
                    <LineChart
                        data={{
                            labels: displayedLabels,
                            datasets: [
                                {
                                    data: dailyTotals,
                                    color: () => 'orange',
                                    strokeWidth: 2,
                                },
                            ],
                            legend: ['Daily Spending'],
                        }}
                        width={screenWidth - 50}
                        height={300}
                        yAxisLabel="£"
                        chartConfig={{
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            fillShadowGradient: 'white',
                            fillShadowGradientFrom: 'white',
                            fillShadowGradientTo: 'white',
                            propsForDots: {
                                r: 0,
                            },
                            propsForBackgroundLines: {
                                strokeWidth: 0.5,
                                strokeDasharray: '2 4',
                                stroke: 'rgba(0, 0, 0, 0.3)',
                            },
                        }}
                        bezier
                        
                    />
                )}

                <Text style={styles.sectionHeader}>Top 5 Expenses</Text>
                {topExpenses.length === 0 ? (
                    <Text style={styles.message}>No expenses recorded for this month.</Text>
                ) : (
                    <View style={styles.topExpensesContainer}>
                        {topExpenses.map((expense) => (
                            <React.Fragment>
                                <ExpenseItem key={expense.getID()} expense={expense} token={token} categoryName={categories.find((cat) => cat.getID() === expense.categoryID)?.name || ""} buttons={false} />
                                <View style={styles.dividerLine} />
                            </React.Fragment>
                        ))}
                        
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    mainContent: {
        paddingBottom: 40,
        rowGap: 30,
    },
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 20,
        marginBottom: 20,
    },
    monthHeader: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    message: {
        textAlign: 'center',
        fontSize: 16,
    },
    topExpensesContainer: {
        rowGap: 15,
        marginTop: 10,
    },
    dividerLine: {
        height: 1,
        backgroundColor: "#ccc",
    },
});