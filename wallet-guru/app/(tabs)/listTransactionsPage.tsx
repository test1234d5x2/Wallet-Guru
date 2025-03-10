import React, { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';
import ExpenseItem from '@/components/listItems/expenseItem';
import Transaction from '@/models/core/Transaction';
import IncomeItem from '@/components/listItems/incomeItem';
import clearRouterHistory from '@/utils/clearRouterHistory';
import ExpenseCategory from '@/models/core/ExpenseCategory';
import DateInputField from '@/components/formComponents/inputFields/dateInputField';
import ModalSelectionExpenseCategories from '@/components/modalSelection/modalSelectionExpenseCategories';
import ModalSelectionTransactionTypes from '@/components/modalSelection/modalSelectionTransactionTypes';
import TransactionType from '@/enums/TransactionType';
import filterExpensesByCategory from '@/utils/filterExpensesByCategory';
import Expense from '@/models/core/Expense';
import Income from '@/models/core/Income';
import getExpenseCategories from '@/utils/apiCalls/getExpenseCategories';
import getExpenses from '@/utils/apiCalls/getExpenses';
import getIncomes from '@/utils/apiCalls/getIncomes';
import getToken from '@/utils/tokenAccess/getToken';
import filterTransactionsByTimeWindow from '@/utils/filterTransactionsByTimeWindow';
import updateCategoriesTimeWindowEnd from '@/utils/analytics/batchProcessRecurrencesUpdates/updateCategoriesTimeWindowEnd';


export default function ViewTransactionsList() {
    setPageTitle("Transactions");

    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [selectedType, setSelectedType] = useState<TransactionType | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
    const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [incomes, setIncomes] = useState<Income[]>([]);

    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to access this page.');
            clearRouterHistory(router);
            router.replace("/loginPage");
            return;
        }

        setToken(data.token);
    });

    useEffect(() => {
        async function getCategories() {
            const categories = await getExpenseCategories(token);
            if (categories) {
                setCategories(categories);
                await updateCategoriesTimeWindowEnd(categories, token);
            } else {
                console.log("Error with getting expense categories list.")
            }

            const expenses = await getExpenses(token);
            if (expenses) {
                setExpenses(expenses);
            } else {
                console.log("Error with getting expense list")
            }

            const incomes = await getIncomes(token);
            if (incomes) {
                setIncomes(incomes);
            } else {
                console.log("Error with getting incomes list")
            }
        }

        getCategories();
    }, [token]);

    const handleTransactionClick = (transaction: Transaction) => {
        clearRouterHistory(router);
        router.navigate(transaction.getPageURL());
    };

    let tomorrow = new Date();
    tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1));

    const combinedTransactions = [];

    if (selectedType !== TransactionType.EXPENSE) {
        const filteredIncomes = filterTransactionsByTimeWindow(incomes, filterStartDate === null ? new Date(1800, 0, 1) : filterStartDate, filterEndDate === null ? tomorrow : filterEndDate);
        combinedTransactions.push(...filteredIncomes.map(income => ({ type: 'income', data: income })));
    }

    if (selectedType !== TransactionType.INCOME) {
        let filteredExpenses = filterTransactionsByTimeWindow(expenses, filterStartDate === null ? new Date(1800, 0, 1) : filterStartDate, filterEndDate === null ? tomorrow : filterEndDate);
        if (selectedCategory) {
            filteredExpenses = filterExpensesByCategory(filteredExpenses, selectedCategory);
        }
        combinedTransactions.push(...filteredExpenses.map(expense => ({ type: 'expense', data: expense })));
    }
    
    combinedTransactions.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

    const transactionDisplayElements = combinedTransactions.map(item => (
        <React.Fragment key={uuid.v4() as string}>
            <TouchableOpacity onPress={() => handleTransactionClick(item.data)}>
                {item.type === 'income' ? (
                    <IncomeItem token={token} income={item.data as Income} />
                ) : (
                    <ExpenseItem
                        token={token}
                        expense={item.data as Expense}
                        categoryName={
                            categories.find(cat => cat.getID() === (item.data as Expense).categoryID)?.name || ""
                        }
                        categoryColor={
                            categories.find(cat => cat.getID() === (item.data as Expense).categoryID)?.colour || ""
                        }
                        buttons
                    />
                )}
            </TouchableOpacity>
            <View style={styles.divider} />
        </React.Fragment>
    ));


    return (
        <View style={styles.container}>
            <TopBar />
            <StatusBar barStyle={"dark-content"} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ rowGap: 30 }}>

                <View style={{ flexDirection: "column", rowGap: 20 }}>
                    <Text style={styles.filterTitle}>Filters:</Text>
                    <View>
                        <ModalSelectionTransactionTypes choices={Object.values(TransactionType) as TransactionType[]} value={selectedType} setValue={setSelectedType} />
                    </View>
                    {selectedType === TransactionType.EXPENSE ? <View><ModalSelectionExpenseCategories choices={categories} value={selectedCategory} setValue={setSelectedCategory} /></View> : ""}
                    <DateInputField date={filterStartDate} setDate={setFilterStartDate} placeholder='Start Date' />
                    <DateInputField date={filterEndDate} setDate={setFilterEndDate} placeholder='End Date' />

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
