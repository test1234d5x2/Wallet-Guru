import React from 'react';
import { View, StyleSheet, Text, Dimensions, Alert } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { PieChart, LineChart } from 'react-native-chart-kit';
import Registry from '@/models/data/Registry';
import { useRouter } from 'expo-router';
import clearRouterHistory from '@/utils/clearRouterHistory';
import getMonthName from '@/utils/getMonthName';

export default function Analytics() {
    setPageTitle('Spending Analytics');

    const screenWidth = Dimensions.get('window').width;
    const registry = Registry.getInstance();
    const user = registry.authService.getAuthenticatedUser();
    const router = useRouter();

    if (!user) {
        Alert.alert('Error', 'You must be logged in to view analytics.');
        clearRouterHistory(router);
        router.replace("/loginPage");
        return;
    }

    const getColor = (index: number) => {
        const colors = ['#C0C0C0', '#A9A9A9', '#E5E5E5', '#696969', '#000000'];
        return colors[index % colors.length];
    };


    const categoryTotals = registry.analyticsService.getCategoryDistribution(user, new Date());
    const categoryDistribution = categoryTotals.map(({ name, total }, index) => ({
        name,
        population: total,
        color: getColor(index),
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
    }));


    const currentDate = new Date();
    const lastFourMonths = Array.from({ length: 5 }, (_, i) => {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() - i);
        return date;
    }).reverse();

    const incomeTrends = registry.incomeService.getMonthlyIncomeTrends(user, lastFourMonths);
    const expenseTrends = registry.expenseService.getMonthlyExpenseTrends(user, lastFourMonths);
    const savingsTrend = registry.analyticsService.getSavingsTrends(user, lastFourMonths);

    const labels = lastFourMonths.map((date) =>
        date.toLocaleString('default', { month: 'short', year: '2-digit' })
    );


    return (
        <View style={styles.container}>
            <TopBar />

            <Text style={styles.header}>Category Distribution: {getMonthName(new Date())} {new Date().getFullYear()}</Text>
            <PieChart
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
            />

            <Text style={styles.header}>Income vs Expenditure</Text>
            <LineChart
                data={{
                    labels,
                    datasets: [
                        {
                            data: incomeTrends,
                            color: () => 'green',
                            strokeWidth: 2,
                        },
                        {
                            data: expenseTrends,
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
                    fillShadowGradientFrom: "white",
                    fillShadowGradientTo: "white",
                    propsForDots: {
                        r: 0,
                    },
                    propsForBackgroundLines: {
                        strokeWidth: 0.5,
                        strokeDasharray: '2 4', // Smaller dashes
                        stroke: 'rgba(0, 0, 0, 0.3)',
                    }
                    
                }}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
        rowGap: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 20,
    },
    barChart: {
        marginTop: 10,
    },
});
