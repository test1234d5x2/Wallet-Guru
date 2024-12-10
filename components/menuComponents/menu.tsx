import { View, StyleSheet} from "react-native";
import MenuItem from './menuItem';


const styles = StyleSheet.create({
    menuContainer: {
        display: "flex",
        flexDirection: "column",
        rowGap: 20,
    },
});


export default function MainMenu() {

    const menuItems = [
        {title: 'Add Expense', link: "/addExpense/addExpensePage"},
        {title: 'Add Income', link: "/addIncome/addIncomePage"},
        {title: 'Transaction History', link: "/listTransactions/listTransactionsPage"},
        {title: 'Create A New Goal', link: "/addGoal/addGoalPage"},
        {title: 'View Goals', link: "/allGoals/allGoalsPage"},
        {title: 'Create An Expense Category', link: "/addExpenseCategory/addExpenseCategoryPage"},
        {title: 'Expense Category Overview', link: "/expenseCategoryOverview/expenseCategoryOverviewPage"},
        {title: 'Spending Analytics', link: ""},
    ];

    return (
        <View>
            <View style={styles.menuContainer}>
                {menuItems.map((item) => {return <MenuItem key={item.title} title={item.title} url={item.link} />})}
            </View>
        </View>
    )
}