import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, ScrollView } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { LineChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import clearRouterHistory from '@/utils/clearRouterHistory';
import getToken from '@/utils/tokenAccess/getToken';
import Expense from '@/models/core/Expense';
import Income from '@/models/core/Income';
import getIncomeVsExpenses from '@/utils/analytics/getIncomeVsExpenses';
import getSavingsTrends from '@/utils/analytics/getSavingsTrends';
import getExpenses from '@/utils/apiCalls/getExpenses';
import getIncomes from '@/utils/apiCalls/getIncomes';
import MonthlySpendingDisplay from '@/components/widgets/MonthlySpendingDisplay';
import MonthSelector from '@/components/widgets/MonthSelector';


// TODO: Change to month by month instead of user-chosen dates.

export default function Analytics() {
    setPageTitle('Analytics Overview');

    const screenWidth = Dimensions.get('window').width;
    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [month, setMonth] = useState<Date>(new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth())));

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


    const currentDate = month;
    const lastFourMonths = Array.from({ length: 5 }, (_, i) => {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() - i);
        return date;
    }).reverse();

    const { incomeTotals, expenseTotals } = getIncomeVsExpenses(expenses, incomes, lastFourMonths)
    const savingsTrend = getSavingsTrends(expenses, incomes, lastFourMonths);

    const labels = lastFourMonths.map((date) =>
        date.toLocaleString('default', { month: 'short', year: '2-digit' })
    );

    return (
        <View style={styles.container}>
            <TopBar />

            <ScrollView contentContainerStyle={{ rowGap: 20, paddingBottom: 40 }} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <MonthSelector month={month} setMonth={setMonth} />
                <MonthlySpendingDisplay income={incomeTotals[incomeTotals.length - 1]} expenses={expenseTotals[expenseTotals.length - 1]} month={currentDate} />

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

                <Text style={styles.header}>Cash Flow Trends</Text>
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
                            legend: ['Net Cash Flow'],
                        }}
                        width={screenWidth - 30}
                        height={300}
                        yAxisLabel=""
                        formatYLabel={(value) => {
                            const num = parseFloat(value);
                            return num < 0 ? `-£${Math.abs(num).toFixed(2)}` : `£${num.toFixed(2)}`;
                        }}

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
    divider: {
        width: 1,
        backgroundColor: "#ccc",
        height: "100%",
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
