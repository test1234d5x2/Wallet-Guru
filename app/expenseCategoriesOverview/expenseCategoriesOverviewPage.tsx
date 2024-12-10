import React from 'react';
import { View, StyleSheet } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';
import ExpenseCategory from '@/models/ExpenseCategory';
import User from '@/models/User';
import ExpenseCategoryItem from '@/components/listItems/expenseCategoryItem';


export default function ViewExpenseCategories() {

    setPageTitle("Expense Categories")

    // This is filler data. Remove once the application is working.
    const user = new User("", "")
    const categories = [
        new ExpenseCategory(user, "Category Name", 400, 1000),
        new ExpenseCategory(user, "Category Name", 400, 1000),
    ]

    let displayElements = []

    for (let category of categories) {
        displayElements.push(
            <ExpenseCategoryItem key={uuid.v4()} category={category} />
        )

        displayElements.push(<View style={styles.divider} key={uuid.v4()} />)
    }


    return (
        <View style={styles.container}>
            <TopBar />

            {displayElements}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
        rowGap: 20,
    },
    categoryContainer: {
        rowGap: 10,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    label: {
        fontSize: 14,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    editButton: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    deleteButton: {
        backgroundColor: "#FF4C4C",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
    },
})