import React from 'react';
import { View, StyleSheet } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';
import ExpenseCategoryItem from '@/components/listItems/expenseCategoryItem';
import Registry from '@/models/data/Registry';
import { useRouter } from 'expo-router';
import clearRouterHistory from '@/utils/clearRouterHistory';

export default function ViewExpenseCategories() {
    setPageTitle("Expense Categories");

    const registry = Registry.getInstance();
    const authService = registry.authService;
    const categoryService = registry.expenseCategoryService;
    const router = useRouter();

    const user = authService.getAuthenticatedUser();

    if (!user) {
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
            {displayElements}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
        rowGap: 20,
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
    },
});
