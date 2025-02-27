import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, ScrollView } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import clearRouterHistory from '@/utils/clearRouterHistory';
import getMonthName from '@/utils/getMonthName';
import getToken from '@/utils/tokenAccess/getToken';
import Expense from '@/models/core/Expense';
import Income from '@/models/core/Income';
import getCategoryDistribution from '@/utils/analytics/getCategoryDistribution';
import ExpenseCategory from '@/models/core/ExpenseCategory';
import getIncomeVsExpenses from '@/utils/analytics/getIncomeVsExpenses';
import getSavingsTrends from '@/utils/analytics/getSavingsTrends';
import getExpenseCategories from '@/utils/apiCalls/getExpenseCategories';
import getExpenses from '@/utils/apiCalls/getExpenses';
import getIncomes from '@/utils/apiCalls/getIncomes';


// TODO: THIS WHOLE PAGE

export default function Analytics() {
    setPageTitle('Spending Analytics');

    const screenWidth = Dimensions.get('window').width;
    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);

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
    }, [token]);

    const getColor = (index: number) => {
        const colors = ['#C0C0C0', '#A9A9A9', '#E5E5E5', '#696969', '#000000'];
        return colors[index % colors.length];
    };


    const currentDate = selectedMonth;
    const lastFourMonths = Array.from({ length: 5 }, (_, i) => {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() - i);
        return date;
    }).reverse();

    const categoryTotals = getCategoryDistribution(expenses, selectedMonth, categories);
    const categoryDistribution = categoryTotals.map(({ name, total }, index) => ({
        name,
        population: total,
        color: getColor(index),
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
    }));

    const { incomeTotals, expenseTotals } = getIncomeVsExpenses(expenses, incomes, lastFourMonths)
    const savingsTrend = getSavingsTrends(expenses, incomes, lastFourMonths);

    const labels = lastFourMonths.map((date) =>
        date.toLocaleString('default', { month: 'short', year: '2-digit' })
    );

    return (
        <View style={styles.container}>
            <TopBar />

            <ScrollView contentContainerStyle={{ rowGap: 20, paddingBottom: 40 }} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={styles.selectMonthText}>Select Month:</Text>
                    {/*<ModalSelectionDates
                        choices={monthsPassedSinceJoinDate(user.getDateJoined())}
                        value={selectedMonth}
                        setValue={setSelectedMonth}
                    /> */}
                </View>

                <Text style={styles.header}>Category Distribution: {getMonthName(selectedMonth)} {selectedMonth.getFullYear()}</Text>
                {categoryDistribution.filter(distribution => distribution.population !== 0).length === 0 ? <Text style={styles.message}>There were no expenses.</Text> : <PieChart
                    data={categoryDistribution}
                    width={screenWidth}
                    height={220}
                    chartConfig={{
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                />}

                <Text style={styles.header}>Income vs Expenditure</Text>
                {expenseTotals.filter(value => value !== 0).length === 0 && incomeTotals.filter(value => value !== 0).length === 0 ? <Text style={styles.message}>There were no expenses or income records.</Text> :
                    <LineChart
                        data={{
                            labels,
                            datasets: [
                                {
                                    data: incomeTotals,
                                    color: () => 'green',
                                    strokeWidth: 2,
                                },
                                {
                                    data: expenseTotals,
                                    color: () => 'red',
                                    strokeWidth: 2,
                                },
                            ],
                            legend: ['Income', 'Expense'],
                        }}
                        width={screenWidth - 30}
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
                    />}

                <Text style={styles.header}>Savings Trends</Text>
                {expenseTotals.filter(value => value !== 0).length === 0 && incomeTotals.filter(value => value !== 0).length === 0 ? <Text style={styles.message}>There were no expenses or income records.</Text> :
                    <LineChart
                        data={{
                            labels,
                            datasets: [
                                {
                                    data: savingsTrend,
                                    color: () => 'blue',
                                    strokeWidth: 2,
                                },
                            ],
                            legend: ['Savings'],
                        }}
                        width={screenWidth - 30}
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
                    />}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        rowGap: 20,
        flex: 1,
    },
    selectMonthText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 20,
    },
    message: {
        textAlign: "center",
        fontSize: 16,
    }
});
