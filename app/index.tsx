import { Text, View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { Link } from "expo-router";
import setPageTitle from "@/components/pageTitle/setPageTitle";

const styles = StyleSheet.create({
    root: {
        backgroundColor: "white",
        rowGap: 20,
        padding: 40,
    },
    text: {fontSize: 20},
})

export default function Index() {

    setPageTitle("PAGE WILL BE REMOVED")

    return (
        <ScrollView contentContainerStyle={styles.root}>
            <Link href={"/menu/menuPage"}>
                <Text style={styles.text}>Menu</Text>
            </Link>

            <Link href={"/login/loginPage"}>
                <Text style={styles.text}>Login</Text>
            </Link>

            <Link href={"/registration/registrationPage"}>
                <Text style={styles.text}>Registration</Text>
            </Link>

            <Link href={"/addExpense/addExpensePage"}>
                <Text style={styles.text}>Add Expense</Text>
            </Link>

            <Link href={"/editExpense/editExpensePage"}>
                <Text style={styles.text}>Edit Expense</Text>
            </Link>
            
            <Link href={"/viewExpenseDetails/viewExpenseDetailsPage"}>
                <Text style={styles.text}>View Expense Details</Text>
            </Link>

            <Link href={"/addIncome/addIncomePage"}>
                <Text style={styles.text}>Add Income</Text>
            </Link>

            <Link href={"/editIncome/editIncomePage"}>
                <Text style={styles.text}>Edit Income</Text>
            </Link>

            <Link href={"/viewIncomeDetails/viewIncomeDetailsPage"}>
                <Text style={styles.text}>View Income Details</Text>
            </Link>

            <Link href={"/addGoal/addGoalPage"}>
                <Text style={styles.text}>Add Goal</Text>
            </Link>

            <Link href={"/updateGoal/updateGoalPage"}>
                <Text style={styles.text}>Update Goal</Text>
            </Link>

            <Link href={"/allGoals/allGoalsPage"}>
                <Text style={styles.text}>View All Goals</Text>
            </Link>

            <Link href={"/viewGoalDetails/viewGoalDetailsPage"}>
                <Text style={styles.text}>View Goal Details</Text>
            </Link>

            <Link href={"/addExpenseCategory/addExpenseCategoryPage"}>
                <Text style={styles.text}>Add Expense Category</Text>
            </Link>

            <Link href={"/editExpenseCategory/editExpenseCategoryPage"}>
                <Text style={styles.text}>Edit Expense Category</Text>
            </Link>
            
            <Link href={"/expenseCategoriesOverview/expenseCategoriesOverviewPage"}>
                <Text style={styles.text}>Expense Categories Overview</Text>
            </Link>

            <Link href={"/accountOverview/accountOverviewPage"}>
                <Text style={styles.text}>Account Overview</Text>
            </Link>

            <Link href={"/dashboard/dashboardPage"}>
                <Text style={styles.text}>Dashboard</Text>
            </Link>

            <Link href={"/listTransactions/listTransactionsPage"}>
                <Text style={styles.text}>View All Transactions</Text>
            </Link>

            <Link href={"/analytics/analyticsPage"}>
                <Text style={styles.text}>Spending Analytics</Text>
            </Link>

            <Link href={"/flatListDropdown"}>
                <Text style={styles.text}>Selection Dropdown Component Test</Text>
            </Link>
        </ScrollView>
    )
}
