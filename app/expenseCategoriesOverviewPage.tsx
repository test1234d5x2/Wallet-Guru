import React from 'react';
import { View, StyleSheet, Alert, ScrollView, Text, TouchableOpacity } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';
import ExpenseCategoryItem from '@/components/listItems/expenseCategoryItem';
import Registry from '@/models/data/Registry';
import { Link, useRouter } from 'expo-router';
import clearRouterHistory from '@/utils/clearRouterHistory';

export default function ViewExpenseCategories() {
    setPageTitle("Expense Categories");

    const registry = Registry.getInstance();
    const authService = registry.authService;
    const categoryService = registry.expenseCategoryService;
    const router = useRouter();

    const user = authService.getAuthenticatedUser();

    if (!user) {
        Alert.alert('Error', 'You must be logged in to view your expense categories.');
        clearRouterHistory(router);
        router.replace("/loginPage");
        return;
    }

    const categories = [...categoryService.getAllCategoriesByUser(user)];

    const displayElements = categories.map((category) => (
        <React.Fragment key={uuid.v4() as string}>
            <ExpenseCategoryItem category={category} />
            <View style={styles.divider} />
        </React.Fragment>
    ));

    return (
        <View style={styles.container}>
            <TopBar />
            <ScrollView contentContainerStyle={{ rowGap: 20 }} showsVerticalScrollIndicator={false}>
                {displayElements.length > 0 ? displayElements :
                    <View style={styles.messageContainer}>
                        <Text style={styles.message}>There are currently no expense categories. </Text>
                        <TouchableOpacity>
                            <Link href="/addExpenseCategoryPage" replace>
                                <Text style={styles.linkText}>Add an expense category</Text>
                            </Link>
                        </TouchableOpacity>
                    </View>
                }
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
        rowGap: 30,
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
    },
    message: {
        textAlign: "center",
        fontSize: 16,
    },
    linkText: {
        fontSize: 16,
        color: "#007BFF",
        textDecorationLine: "underline",
    },
    messageContainer: {
        alignItems: "center",
        rowGap: 10,
    },
});
