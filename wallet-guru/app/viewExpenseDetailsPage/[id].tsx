import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import clearRouterHistory from '@/utils/clearRouterHistory';
import Expense from '@/models/core/Expense';
import getToken from '@/utils/tokenAccess/getToken';
import getExpenseByID from '@/utils/apiCalls/getExpensesByID';
import deleteExpense from '@/utils/apiCalls/deleteExpense';
import ExpenseCategory from '@/models/core/ExpenseCategory';
import getExpenseCategories from '@/utils/apiCalls/getExpenseCategories';
import ViewReceiptModal from '@/components/modalView/viewReceiptModal';


export default function ExpenseDetailsScreen() {
    const { id } = useLocalSearchParams();

    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [expense, setExpense] = useState<Expense>();
    const [category, setCategory] = useState<ExpenseCategory>();
    const [error, setError] = useState<string>('');
    const [viewReceipt, setViewReceipt] = useState<boolean>(false);

    setPageTitle(!expense ? "" : expense.title)


    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to access this page.');
            clearRouterHistory(router);
            router.replace("/loginPage");
            return;
        }
        setToken(data.token);
        setEmail(data.email);
    });


    useEffect(() => {
        async function getExpense() {
            getExpenseByID(token, id as string).then((expense) => {
                setExpense(expense);
            }).catch((error: Error) => {
                Alert.alert("Expense Not Found")
                console.log(error.message);
                clearRouterHistory(router);
                router.replace("/listTransactionsPage");
            })
        }

        if (token) getExpense();
    }, [token]);


    useEffect(() => {
        async function getExpenseCategory() {
            if (expense) {
                getExpenseCategories(token).then((categories) => {
                    setCategory(categories.find((cat) => cat.getID() === expense.categoryID));
                }).catch((error: Error) => {
                    Alert.alert("Error", "Could not load the category name.")
                    console.log(error.message);
                    clearRouterHistory(router);
                    router.replace("/listTransactionsPage");
                })
            }
        }

        if (token && expense) getExpenseCategory();
    }, [token, expense]);


    const handleEdit = () => {
        if (!expense) {
            clearRouterHistory(router);
            router.navigate("/loginPage");
            return;
        }
        router.navigate(expense.getEditURL());
    };

    const handleDelete = () => {
        Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: () => {
                    deleteExpense(token, id as string).then((complete) => {
                        if (complete) {
                            Alert.alert('Success', 'Expense deleted successfully!');
                            clearRouterHistory(router);
                            router.replace("/listTransactionsPage");
                        }
                    }).catch((err: Error) => {
                        setError(err.message);
                    })
                },
            },
        ]);
    };

    return (
        <View style={styles.mainContainer}>
            <TopBar />

            {!expense ? "" : <View style={styles.container}>
                <Text style={styles.detail}>Category: {!category ? "" : category.name}</Text>
                <Text style={styles.detail}>Amount: £{Math.abs(expense.amount).toFixed(2)}</Text>
                <Text style={styles.detail}>Date: {expense.date.toDateString()}</Text>
                <View>
                    <Text style={styles.notesTitle}>Notes:</Text>
                    <Text style={styles.notes}>{expense.notes}</Text>
                </View>

                {error !== '' && (
                    <View style={styles.errorTextContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <TouchableOpacity onPress={() => setViewReceipt(true)}>
                    <Text style={styles.viewReceipt}>View Receipt</Text>
                </TouchableOpacity>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>

                {expense.receipt ? <ViewReceiptModal uri={expense.receipt} visible={viewReceipt} setViewReceipt={setViewReceipt} />: ""}
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
    errorTextContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: 'red',
        fontSize: 14,
    },
});
