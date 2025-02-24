import { View, StyleSheet} from "react-native";
import MenuItem from './menuItem';


export default function MainMenu() {

    const menuItems = [
        {title: 'Add Expense', link: "/addExpensePage"},
        {title: 'Add Income', link: "/addIncomePage"},
        {title: 'Transaction History', link: "/listTransactionsPage"},
        {title: 'Create A New Goal', link: "/addGoalPage"},
        {title: 'View Goals', link: "/allGoalsPage"},
        {title: 'Create An Expense Category', link: "/addExpenseCategoryPage"},
        {title: 'Expense Category Overview', link: "/expenseCategoriesOverviewPage"},
        {title: 'Dashboard', link: "/dashboardPage"},
        {title: 'Spending Analytics', link: "/analyticsPage"},
        {title: "Add Recurrent Expense", link: "/addRecurringExpensePage"},
        {title: "Add Recurrent Income", link: "/addRecurringIncomePage"},
        {title: "NEEDS REMOVING: View Recurrent Expense", link: "/viewRecurringExpenseDetailsPage/jhbjhbhjbjhbjh"},
        {title: "NEEDS REMOVING: View Recurrent Income", link: "/viewRecurringIncomeDetailsPage/jhbjhbhjbjhbjh"},
        {title: "NEEDS REMOVING: Edit Recurrent Expense", link: "/editRecurringExpensePage/jhbjhbhjbjhbjh"},
        {title: "NEEDS REMOVING: Edit Recurrent Income", link: "/editRecurringIncomePage/jhbjhbhjbjhbjh"},
        {title: "Current Recurring Transactions", link: "/listRecurringTransactionsPage"},
    ]

    return (
        <View>
            <View style={styles.menuContainer}>
                {menuItems.map((item) => {return <MenuItem key={item.title} title={item.title} url={item.link} />})}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    menuContainer: {
        display: "flex",
        flexDirection: "column",
        rowGap: 20,
    },
})