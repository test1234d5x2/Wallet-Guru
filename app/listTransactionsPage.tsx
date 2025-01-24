import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';
import Registry from '@/models/data/Registry';
import ExpenseItem from '@/components/listItems/expenseItem';
import Transaction from '@/models/Transaction';
import IncomeItem from '@/components/listItems/incomeItem';
import clearRouterHistory from '@/utils/clearRouterHistory';
import ExpenseCategory from '@/models/ExpenseCategory';
import DateInputField from '@/components/formComponents/inputFields/dateInputField';
import ModalSelectionExpenseCategories from '@/components/modalSelection/modalSelectionExpenseCategories';
import ModalSelectionTransactionTypes from '@/components/modalSelection/modalSelectionTransactionTypes';
import TransactionType from '@/enums/TransactionType';


export default function ViewTransactionsList() {
    setPageTitle("Transactions");

    const router = useRouter();
    const registry = Registry.getInstance();
    const authService = registry.authService;
    const expenseService = registry.expenseService;
    const expenseCategoryService = registry.expenseCategoryService;
    const incomeService = registry.incomeService;
    const user = authService.getAuthenticatedUser();

    if (!user) {
        Alert.alert('Error', 'You must be logged in to view your transactions.');
        clearRouterHistory(router);
        router.replace("/loginPage");
        return;
    }

    const [selectedType, setSelectedType] = useState<TransactionType>(TransactionType.UNKNOWN);
    const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>(new ExpenseCategory(user, "No Filters", 0));
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    const expenses = expenseService.getAllExpensesByUser(user);
    const incomes = incomeService.getAllIncomesByUser(user);
    const categories = expenseCategoryService.getAllCategoriesByUser(user);

    const handleTransactionClick = (transaction: Transaction) => {
        clearRouterHistory(router);
        router.navigate(transaction.getPageURL());
    };

    const transactionDisplayElements = [
        ...expenses.map((expense) => (
            <React.Fragment key={uuid.v4() as string}>
                <TouchableOpacity onPress={() => handleTransactionClick(expense)}>
                    <ExpenseItem registry={registry} expense={expense} />
                </TouchableOpacity>
                <View style={styles.divider} />
            </React.Fragment>
        )),
        ...incomes.map((income) => (
            <React.Fragment key={uuid.v4() as string}>
                <TouchableOpacity onPress={() => handleTransactionClick(income)}>
                    <IncomeItem registry={registry} income={income} />
                </TouchableOpacity>
                <View style={styles.divider} />
            </React.Fragment>
        )),
    ];

    return (
        <View style={styles.container}>
            <TopBar />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{rowGap: 30}}>

                <View style={{flexDirection: "column", rowGap: 20}}>
                    <Text style={styles.filterTitle}>Filters:</Text>
                    <View>
                        <ModalSelectionTransactionTypes choices={Object.values(TransactionType).filter(item => item !== "") as TransactionType[]} value={selectedType} setValue={setSelectedType} />
                    </View>
                    <View>
                        <ModalSelectionExpenseCategories choices={categories} value={selectedCategory} setValue={setSelectedCategory} />
                    </View>
                    <View style={{flexDirection: "row", columnGap: 20, justifyContent: "space-between"}}>
                        <DateInputField date={startDate} setDate={setStartDate} placeholder='Start Date' />
                        <DateInputField date={endDate} setDate={setEndDate} placeholder='End Date' />
                    </View>

                </View>

                <View style={{ rowGap: 30 }}>
                    {transactionDisplayElements.length > 0 ? transactionDisplayElements :
                        <View style={styles.messageContainer}>
                            <Text style={styles.message}>There are currently no transactions.</Text>
                            <TouchableOpacity>
                                <Link href="/addExpensePage" replace>
                                    <Text style={styles.linkText}>Add an expense</Text>
                                </Link>
                            </TouchableOpacity>
                        </View>

                    }
                </View>

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
    filterTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
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
    message: {
        textAlign: "center",
        fontSize: 16,
    }
});
