import getEndOfMonth from "@/utils/getEndOfMonth";
import getMonthName from "@/utils/getMonthName";
import getStartOfMonth from "@/utils/getStartOfMonth";
import { View, Text, StyleSheet } from "react-native";


interface MonthlySpendingDisplayProps {
    income: number;
    expenses: number;
    month: Date;
}

// TODO April displays as 31 April - 29 April
export default function MonthlySpendingDisplay(props: MonthlySpendingDisplayProps) {
    const startOfMonth = getStartOfMonth(props.month);
    const endOfMonth = getEndOfMonth(props.month);

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{`${startOfMonth.getUTCDate()} ${getMonthName(startOfMonth)} ${startOfMonth.getUTCFullYear()}`} - {`${endOfMonth.getUTCDate()} ${getMonthName(endOfMonth)} ${endOfMonth.getUTCFullYear()}`}</Text>
            </View>
            <View style={styles.summaryContainer}>
                <View>
                    <Text style={styles.label}>Income</Text>
                    <Text style={styles.value}>£{props.income.toFixed(2)}</Text>
                </View>
                <View style={styles.divider} />
                <View>
                    <Text style={styles.label}>Spending</Text>
                    <Text style={styles.value}>£{props.expenses.toFixed(2)}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    summaryContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    section: {
        rowGap: 15,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
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
});
