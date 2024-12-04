import { Text, View, StyleSheet, Dimensions } from "react-native";
import { Link } from "expo-router";
import setPageTitle from "@/components/pageTitle/setPageTitle";

const styles = StyleSheet.create({
    root: {
        backgroundColor: "white",
        minHeight: Dimensions.get("window")['height'],
        rowGap: 20,
    }
})

export default function Index() {

    setPageTitle("PAGE WILL BE REMOVED")

    return (
        <View style={styles.root}>
            <Link href={"/menu/menuPage"}>
                <Text>Menu</Text>
            </Link>

            <Link href={"/login/loginPage"}>
                <Text>Login</Text>
            </Link>

            <Link href={"/registration/registrationPage"}>
                <Text>Registration</Text>
            </Link>

            <Link href={"/addExpense/addExpensePage"}>
                <Text>Add Expense</Text>
            </Link>

            <Link href={"/editExpense/editExpensePage"}>
                <Text>Edit Expense</Text>
            </Link>
            
            <Link href={"/viewExpenseDetails/viewExpenseDetailsPage"}>
                <Text>View Expense Details</Text>
            </Link>

            <Link href={"/addIncome/addIncomePage"}>
                <Text>Add Income</Text>
            </Link>

            <Link href={"/editIncome/editIncomePage"}>
                <Text>Edit Income</Text>
            </Link>

            <Link href={"/viewIncomeDetails/viewIncomeDetailsPage"}>
                <Text>View Income Details</Text>
            </Link>

            <Link href={"/addGoal/addGoalPage"}>
                <Text>Add Goal</Text>
            </Link>

            <Link href={"/updateGoal/updateGoalPage"}>
                <Text>Update Goal</Text>
            </Link>

            <Link href={"/allGoals/allGoalsPage"}>
                <Text>View All Goals</Text>
            </Link>

            <Link href={"/viewGoalDetails/viewGoalDetailsPage"}>
                <Text>View Goal Details</Text>
            </Link>

            <Link href={"/addExpenseCategory/addExpenseCategoryPage"}>
                <Text>Add Expense Category</Text>
            </Link>

            <Link href={"/editExpenseCategory/editExpenseCategoryPage"}>
                <Text>Edit Expense Category</Text>
            </Link>
            
            <Link href={"/expenseCategoriesOverview/expenseCategoriesOverviewPage"}>
                <Text>Expense Categories Overview</Text>
            </Link>

            <Link href={"/accountOverview/accountOverviewPage"}>
                <Text>Account Overview</Text>
            </Link>

            <Link href={"/flatListTest"}>
                <Text>Selection Dropdown Component Test</Text>
            </Link>
        </View>
    )
}
