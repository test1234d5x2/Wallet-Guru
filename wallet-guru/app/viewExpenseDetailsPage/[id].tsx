import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import clearRouterHistory from '@/utils/clearRouterHistory';
import Expense from '@/models/Expense';
import getToken from '@/utils/tokenAccess/getToken';




async function getExpenseByID(token: string, id: string): Promise<Expense> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const GET_EXPENSE_URL = `http://${API_DOMAIN}/api/expenses/${id}`;

    const response = await fetch(GET_EXPENSE_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    };

    const data: any = await response.json();
    return new Expense(data.userID, data.title, data.amount, data.date, data.notes, data.categoryID, data.receipt, data.id);
}




export default function ExpenseDetailsScreen() {
    setPageTitle("");
    const { id } = useLocalSearchParams();

    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [expense, setExpense] = useState<Expense>();


    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to view your dashboard.');
            clearRouterHistory(router);
            router.replace("/loginPage");
            return;
        }

        setToken(data.token);
        setEmail(data.email);
    });

    useEffect(() => {
        async function getExpense() {
            getExpenseByID(token, id as string).then((data) => {
                setExpense(data);
                setPageTitle(data.title)
            }).catch((error: Error) => {
                Alert.alert("Expense Not Found")
                console.log(error.message);
                clearRouterHistory(router);
                router.replace("/listTransactionsPage");
            })
        }

        getExpense();
    }, [token]);

    const handleEdit = () => {
        if (!expense) {
            clearRouterHistory(router);
            router.navigate("/loginPage");
            return;
        }
        router.navigate("/editExpensePage/" + expense.getID());
    };

    const handleDelete = () => {
        Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: () => {
                    try {
                        // USE EMAIL AND TOKEN TO DELETE VIA API.
                        Alert.alert('Success', 'Expense deleted successfully!');
                        clearRouterHistory(router);
                        router.replace("/listTransactionsPage");
                    } catch (err: any) {
                        Alert.alert('Error', err.message);
                    }
                },
            },
        ]);
    };

    const handleViewReceipt = () => {
        Alert.alert("Feature Coming Soon", "Receipt viewing is not yet implemented.");
    };

    return (
        <View style={styles.mainContainer}>
            <TopBar />

            {!expense ? "" : <View style={styles.container}>
                <Text style={styles.detail}>Category: {expense.categoryID}</Text>
                <Text style={styles.detail}>Amount: £{Math.abs(expense.amount).toFixed(2)}</Text>
                <Text style={styles.detail}>Date: {expense.date.toDateString()}</Text>
                <View>
                    <Text style={styles.notesTitle}>Notes:</Text>
                    <Text style={styles.notes}>{expense.notes}</Text>
                </View>

                <TouchableOpacity onPress={handleViewReceipt}>
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
