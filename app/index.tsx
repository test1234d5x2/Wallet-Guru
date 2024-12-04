import { Text, View, StyleSheet, Dimensions } from "react-native";
import { Link } from "expo-router";
import setPageTitle from "@/components/pageTitle/setPageTitle";

const styles = StyleSheet.create({
    root: {
        backgroundColor: "white",
        minHeight: Dimensions.get("window")['height'],
        rowGap: 20,
    }
});

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

            <Link href={"/flatListTest"}>
                <Text>Selection Dropdown Componenet Test</Text>
            </Link>
        </View>
    );
}
