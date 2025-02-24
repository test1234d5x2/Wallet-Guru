import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import clearRouterHistory from '@/utils/clearRouterHistory';
import getToken from '@/utils/tokenAccess/getToken';
import ExpenseCategory from '@/models/core/ExpenseCategory';
import RecurringExpense from '@/models/recurrenceModels/RecurringExpense';
import RecurrenceRule from '@/models/recurrenceModels/RecurrenceRule';
import BasicRecurrenceRule from '@/models/recurrenceModels/BasicRecurrenceRule';
import Frequency from '@/enums/Frequency';
import convertFrequencyToTextDisplay from '@/utils/convertFrequencyToTextDisplay';
import deleteRecurringExpense from '@/utils/apiCalls/deleteRecurringExpense';


export default function RecurrentExpenseDetailsScreen() {
    const { id } = useLocalSearchParams();

    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [recurringExpense, setRecurringExpense] = useState<RecurringExpense>();
    const [category, setCategory] = useState<ExpenseCategory>();

    setPageTitle(!recurringExpense ? "" : recurringExpense.title);

    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to view a recurrent expense.');
            clearRouterHistory(router);
            router.replace("/loginPage");
            return;
        }
        setToken(data.token);
        setEmail(data.email);
    });

    useEffect(() => {
        let today = new Date();
        let endDate = new Date(today.setDate(today.getDate() + 5));

        setCategory(
            new ExpenseCategory("", "Some Category", 500, new BasicRecurrenceRule(Frequency.Daily, 4, new Date(), endDate), "1")
        )

        today = new Date();
        endDate = new Date(today.setDate(today.getDate() + 25));

        setRecurringExpense(
            new RecurringExpense("", "Title", 25, new Date(), "Some Notes", "1", new BasicRecurrenceRule(Frequency.Daily, 2, new Date(), endDate))
        )
    }, [])

    // ONCE THE BACKEND API IS IMPLEMENTED TO ACCUSTOM THIS, WE SHALL CONTINUE HERE.
    // useEffect(() => {
    //     async function getRecurringExpense() {
    //         getExpenseByID(token, id as string).then((expense) => {
    //             setRecurringExpense(expense);
    //         }).catch((error: Error) => {
    //             Alert.alert("Expense Not Found")
    //             console.log(error.message);
    //             clearRouterHistory(router);
    //             router.replace("/listTransactionsPage");
    //         })
    //     }

    //     if (token) getRecurringExpense();
    // }, [token]);


    // useEffect(() => {
    //     async function getExpenseCategory() {
    //         if (expense) {
    //             getExpenseCategories(token).then((categories) => {
    //                 setCategory(categories.find((cat) => cat.getID() === expense.categoryID));
    //             }).catch((error: Error) => {
    //                 Alert.alert("Error", "Could not load the category name.")
    //                 console.log(error.message);
    //                 clearRouterHistory(router);
    //                 router.replace("/listTransactionsPage");
    //             })
    //         }
    //     }

    //     if (token && expense) getExpenseCategory();
    // }, [token, expense]);


    const handleEdit = () => {
        if (!recurringExpense) {
            clearRouterHistory(router);
            router.navigate("/loginPage");
            return;
        }
        router.navigate(recurringExpense.getEditURL());
    };

    const handleDelete = () => {
        Alert.alert('Delete Expense', 'Are you sure you want to delete this recurring expense?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: () => {
                    deleteRecurringExpense(token, id as string).then((complete) => {
                        if (complete) {
                            Alert.alert('Success', 'Expense deleted successfully!');
                            clearRouterHistory(router);
                            router.replace("/listRecurringTransactionsPage");
                        }
                    }).catch((err: Error) => {
                        Alert.alert("Failed", "Failed to delete expense.");
                        console.log(err.message);
                    })
                },
            },
        ]);
    };

    return (
        <View style={styles.mainContainer}>
            <TopBar />

            {!recurringExpense ? "" : <View style={styles.container}>
                <Text style={styles.detail}>Category: {!category ? "": category.name}</Text>
                <Text style={styles.detail}>Amount: £{Math.abs(recurringExpense.amount).toFixed(2)}</Text>
                <Text style={styles.detail}>Start Date: {recurringExpense.recurrenceRule.startDate.toDateString()}</Text>
                <Text style={styles.detail}>Next Transaction Date: {recurringExpense.recurrenceRule.nextTriggerDate.toDateString()}</Text>
                {!recurringExpense.recurrenceRule.endDate ? "": <Text style={styles.detail}>End Date: {recurringExpense.recurrenceRule.endDate.toDateString()}</Text>}
                <Text style={styles.detail}>Frequency: {`${recurringExpense.recurrenceRule.interval} ${convertFrequencyToTextDisplay(recurringExpense.recurrenceRule.frequency)}${recurringExpense.recurrenceRule.interval !== 1 ? "s": ""}`}</Text>
                <View>
                    <Text style={styles.notesTitle}>Notes:</Text>
                    <Text style={styles.notes}>{recurringExpense.notes}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>}
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: "white",
        rowGap: 20
    },
    container: {
        backgroundColor: '#fff',
        rowGap: 20
    },
    detail: {
        fontSize: 16,
        marginBottom: 10,
    },
    notesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 5,
    },
    notes: {
        fontSize: 14,
        color: '#555',
    },
    viewReceipt: {
        marginTop: 20,
        fontSize: 16,
        color: '#007BFF',
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    button: {
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#007BFF',
    },
    deleteButton: {
        backgroundColor: '#FF4C4C',
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
});
