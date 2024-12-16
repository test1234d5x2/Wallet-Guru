import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { PieChart, BarChart } from "react-native-chart-kit";


const screenWidth = Dimensions.get("window").width;


export default function Analytics() {

    setPageTitle("Spending Analytics")

    const pieData = [
        { name: "Rent", population: 33, color: "#C0C0C0", legendFontColor: "#7F7F7F", legendFontSize: 12 },
        { name: "Food", population: 21, color: "#A9A9A9", legendFontColor: "#7F7F7F", legendFontSize: 12 },
        { name: "Entertainment", population: 1, color: "#E5E5E5", legendFontColor: "#7F7F7F", legendFontSize: 12 },
        { name: "Travel", population: 33, color: "#696969", legendFontColor: "#7F7F7F", legendFontSize: 12 },
        { name: "Utilities", population: 21, color: "#000000", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    ];

    const barData = {
        labels: ["Jul-24", "Aug-24", "Sep-24", "Oct-24"],
        datasets: [
            {
                data: [1000, 800, 1000, 750], // Income values
                color: () => "green",
            },
            {
                data: [750, 1000, 750, 1000], // Expenditure values
                color: () => "red",
            },
        ],
    };


    return (
        <View style={styles.container}>
            <TopBar />

            <Text style={styles.header}>Category Distribution</Text>
            <PieChart
                data={pieData}
                width={screenWidth}
                height={200}
                chartConfig={{
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    barPercentage: 0.5,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
            />

            {/* Bar Chart Section */}
            <Text style={styles.header}>Income vs Expenditure</Text>
            <BarChart
                style={styles.barChart}
                data={barData}
                width={screenWidth - 30}
                height={300}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    barPercentage: 0.5,
                }}
                verticalLabelRotation={0}
                showBarTops={false}
            />
        </View >
    )
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
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        marginTop: 20,
    },
    barChart: {
        marginTop: 10,
    },
})