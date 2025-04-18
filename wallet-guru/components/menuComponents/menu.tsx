import { View, Text, StyleSheet, ScrollView } from "react-native";
import MenuItem from "./menuItem";

export default function MainMenu() {
    const groupedMenuItems = [
        {
            groupTitle: "Dashboard",
            items: [
                { title: "Dashboard", link: "/dashboardPage" },
            ],
        },
        {
            groupTitle: "Transactions",
            items: [
                { title: "Add Expense", link: "/addExpensePage" },
                { title: "Add Income", link: "/addIncomePage" },
                { title: "Transaction History", link: "/listTransactionsPage" },
            ],
        },
        {
            groupTitle: "Recurring Transactions",
            items: [
                { title: "Add Recurrent Expense", link: "/addRecurringExpensePage" },
                { title: "Add Recurrent Income", link: "/addRecurringIncomePage" },
                { title: "Current Recurring Transactions", link: "/listRecurringTransactionsPage" },
            ],
        },
        {
            groupTitle: "Categories",
            items: [
                { title: "Create An Expense Category", link: "/addExpenseCategoryPage" },
                { title: "Create An Expense Category", link: "/addIncomeCategoryPage" },
                { title: "Expense Category Overview", link: "/expenseCategoriesOverviewPage" },
                { title: "Expense Category Overview", link: "/incomeCategoriesOverviewPage" },
            ],
        },
        {
            groupTitle: "Goals",
            items: [
                { title: "Create A New Goal", link: "/addGoalPage" },
                { title: "View Goals", link: "/allGoalsPage" },
            ],
        },
        {
            groupTitle: "Analytics",
            items: [
                { title: "Analytics Overview", link: "/analytics/overviewPage" },
                { title: "Detailed Transaction Analytics", link: "/analytics/detailedTransactionAnalyticsPage" },
                { title: "Expense Categories Analytics", link: "/analytics/expenseCategoryPage" },
            ],
        },
    ];

    return (
        <ScrollView style={styles.container}>
            {groupedMenuItems.map((group) => (
                <View key={group.groupTitle} style={styles.groupContainer}>
                    <Text style={styles.groupTitle}>{group.groupTitle}</Text>
                    <View style={styles.itemsContainer}>
                        {group.items.map((item) => (
                            <MenuItem key={item.title} title={item.title} url={item.link} />
                        ))}
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    groupContainer: {
        marginBottom: 32,
    },
    groupTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    itemsContainer: {
        rowGap: 12,
    },
});
