import React from 'react';
import { View, StyleSheet } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';
import ExpenseCategoryItem from '@/components/listItems/expenseCategoryItem';
import Registry from '@/models/Registry';
import { useRouter } from 'expo-router';
import clearRouterHistory from '@/utils/clearRouterHistory';

export default function ViewExpenseCategories() {

    setPageTitle("Expense Categories")

    const registry = Registry.getInstance()
    const user = registry.getAuthenticatedUser()
    const router = useRouter()

    if (!user) {
        clearRouterHistory(router);
        router.replace("/loginPage")
        return
    }

    const categories = registry.getAllExpenseCategoriesByUser(user)

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
