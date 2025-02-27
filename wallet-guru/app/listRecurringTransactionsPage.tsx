import React, { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';
import Transaction from '@/models/core/Transaction';
import clearRouterHistory from '@/utils/clearRouterHistory';
import ExpenseCategory from '@/models/core/ExpenseCategory';
import DateInputField from '@/components/formComponents/inputFields/dateInputField';
import ModalSelectionExpenseCategories from '@/components/modalSelection/modalSelectionExpenseCategories';
import ModalSelectionTransactionTypes from '@/components/modalSelection/modalSelectionTransactionTypes';
import TransactionType from '@/enums/TransactionType';
import filterTransactionsByDate from '@/utils/filterTransactionsByDate';
import filterExpensesByCategory from '@/utils/filterExpensesByCategory';
import getExpenseCategories from '@/utils/apiCalls/getExpenseCategories';
import getToken from '@/utils/tokenAccess/getToken';
import RecurringExpense from '@/models/recurrenceModels/RecurringExpense';
import RecurringIncome from '@/models/recurrenceModels/RecurringIncome';
import getRecurringExpenses from '@/utils/apiCalls/getRecurringExpenses';
import getRecurringIncomes from '@/utils/apiCalls/getReccuringIncomes';
import RecurringExpenseItem from '@/components/listItems/recurringExpenseItem';
import RecurringIncomeItem from '@/components/listItems/recurringIncomeItem';


export default function ViewReccuringTransactionsList() {
    setPageTitle("Recurring Transactions");

    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [selectedType, setSelectedType] = useState<TransactionType | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
    const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
    const [recurringIncomes, setRecurringIncomes] = useState<RecurringIncome[]>([]);

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
            const result = await getExpenseCategories(token);
            if (result) {
                setCategories(result);
            } else {
                console.log("Error with getting expense categories list.")
            }
        }

        getCategories();
    }, [token]);

    useEffect(() => {
        async function getExpenseList() {
            const result = await getRecurringExpenses(token);
            if (result) {
                setRecurringExpenses(result);
            } else {
                console.log("Error with getting recurring expenses list")
            }
        }

        getExpenseList();
    }, [token, categories]);

    useEffect(() => {
        async function getIncomesList() {
            const result = await getRecurringIncomes(token);
            if (result) {
                setRecurringIncomes(result);
            } else {
                console.log("Error with getting recurring incomes list")
            }
        }

        getIncomesList();
    }, [token]);


    const handleTransactionClick = (transaction: Transaction) => {
        clearRouterHistory(router);
        router.navigate(transaction.getPageURL());
    };

    const transactionDisplayElements = [];
    let transactions = [];
    let tomorrow = new Date();
    tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1))

    transactions = filterTransactionsByDate(recurringIncomes, filterStartDate === null ? new Date(1800, 0, 1) : filterStartDate, filterEndDate === null ? tomorrow : filterEndDate)
    transactionDisplayElements.push(
        ...transactions.map((ri) => (
            <React.Fragment key={uuid.v4() as string}>
                <TouchableOpacity onPress={() => handleTransactionClick(ri)}>
                    <RecurringIncomeItem token={token} recurringIncome={ri} />
                </TouchableOpacity>
                <View style={styles.divider} />
            </React.Fragment>
        )),
    )

    transactions = filterTransactionsByDate(recurringExpenses, filterStartDate === null ? new Date(1800, 0, 1) : filterStartDate, filterEndDate === null ? tomorrow : filterEndDate)
    if (selectedCategory) {
        transactions = filterExpensesByCategory(transactions, selectedCategory)
    }
    transactionDisplayElements.push(
        ...transactions.map((rx) => (
            <React.Fragment key={uuid.v4() as string}>
                <TouchableOpacity onPress={() => handleTransactionClick(rx)}>
                    <RecurringExpenseItem categoryName={categories.find((cat) => cat.getID() === rx.categoryID)?.name || ""} token={token} recurringExpense={rx} />
                </TouchableOpacity>
                <View style={styles.divider} />
            </React.Fragment>
        )),
    )

    return (
        <View style={styles.container}>
            <TopBar />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ rowGap: 30 }}>

                <View style={{ flexDirection: "column", rowGap: 20 }}>
                    <Text style={styles.filterTitle}>Filters:</Text>
                    <View>
                        <ModalSelectionTransactionTypes choices={Object.values(TransactionType) as TransactionType[]} value={selectedType} setValue={setSelectedType} />
                    </View>
                    {selectedType === TransactionType.EXPENSE ? <View><ModalSelectionExpenseCategories choices={categories} value={selectedCategory} setValue={setSelectedCategory} /></View> : ""}
                    <View style={{ flexDirection: "row", columnGap: 20, justifyContent: "space-between" }}>
                        <DateInputField date={filterStartDate} setDate={setFilterStartDate} placeholder='Start Date' />
                        <DateInputField date={filterEndDate} setDate={setFilterEndDate} placeholder='End Date' />
                    </View>

                </View>

                <View style={{ rowGap: 30 }}>
                    {transactionDisplayElements.length > 0 ? transactionDisplayElements :
                        <View style={styles.messageContainer}>
                            <Text style={styles.message}>There are currently no transactions.</Text>
                            <TouchableOpacity>
                                <Link href="/addRecurringExpensePage" replace>
                                    <Text style={styles.linkText}>Add a recurring expense</Text>
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
