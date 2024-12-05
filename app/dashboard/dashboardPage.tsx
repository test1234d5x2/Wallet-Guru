import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import * as Progress from 'react-native-progress';


export default function Dashboard() {

    setPageTitle("Dashboard")

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TopBar />

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>This Month:</Text>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>View Analytics</Text>
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
                        <Text style={styles.linkText}>View All</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.transaction}>
                    <Text style={styles.transactionName}>Expense Name</Text>
                    <Text style={styles.transactionAmount}>-£25.50</Text>
                </View>
                <View style={styles.dividerLine} />
                <View style={styles.transaction}>
                    <Text style={styles.transactionName}>Income Name</Text>
                    <Text style={styles.transactionAmount}>+£1000.00</Text>
                </View>
                <View style={styles.dividerLine} />
                <View style={styles.transaction}>
                    <Text style={styles.transactionName}>Expense Name</Text>
                    <Text style={styles.transactionAmount}>-£25.50</Text>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Budget Overview:</Text>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>View</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.progressContainer}>
                    <View style={styles.progressTextContainer}>
                        <Text style={styles.budgetLabel}>Food</Text>
                        <Text style={styles.budgetPercentage}>40%</Text>
                    </View>
                    <View>
                        <Progress.Bar progress={0.4} width={null} />
                    </View>
                </View>
                <View style={styles.progressContainer}>
                    <View style={styles.progressTextContainer}>
                        <Text style={styles.budgetLabel}>Travel</Text>
                        <Text style={styles.budgetPercentage}>40%</Text>
                    </View>
                    <View>
                        <Progress.Bar progress={0.4} width={null} />
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        minHeight: Dimensions.get("window").height,
        rowGap: 50,
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