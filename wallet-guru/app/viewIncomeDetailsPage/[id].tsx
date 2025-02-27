import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import clearRouterHistory from '@/utils/clearRouterHistory';
import Income from '@/models/core/Income';
import getToken from '@/utils/tokenAccess/getToken';
import getIncomeByID from '@/utils/apiCalls/getIncomeByID';
import deleteIncome from '@/utils/apiCalls/deleteIncome';


export default function IncomeDetailsScreen() {
    const { id } = useLocalSearchParams();

    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [income, setIncome] = useState<Income>();

    setPageTitle(!income ? "" : income.title);


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
        async function getIncome() {
            getIncomeByID(token, id as string).then((data) => {
                setIncome(data);
            }).catch((error: Error) => {
                Alert.alert("Income Not Found")
                console.log(error.message);
                clearRouterHistory(router);
                router.replace("/listTransactionsPage");
            })
        }

        if (token) getIncome();
    }, [token]);


    const handleEdit = () => {
        if (!income) {
            clearRouterHistory(router);
            router.navigate("/loginPage");
            return;
        }
        router.navigate(income.getEditURL());
    }

    const handleDelete = () => {
        Alert.alert('Delete Income', 'Are you sure you want to delete this income source?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: () => {
                    deleteIncome(token, id as string).then((complete) => {
                        if (complete) {
                            Alert.alert('Success', 'Income deleted successfully!');
                            clearRouterHistory(router);
                            router.replace("/listTransactionsPage");
                        }
                    }).catch((err: Error) => {
                        // TODO: Set error as text message instead of alert.
                        Alert.alert("Failed", "Failed to delete income.");
                        console.log(err.message);
                    })
                }
            },
        ]);
    }

    return (
        <View style={styles.mainContainer}>
            <TopBar />
            {!income ? "" : <View style={styles.container}>
                <Text style={styles.detail}>Amount: £{income.amount.toFixed(2)}</Text>
                <Text style={styles.detail}>Date: {income.date.toDateString()}</Text>
                <View>
                    <Text style={styles.notesTitle}>Notes:</Text>
                    <Text style={styles.notes}>{income.notes}</Text>
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
    )
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
