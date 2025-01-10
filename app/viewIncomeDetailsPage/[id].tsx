import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Registry from '@/models/Registry';
import clearRouterHistory from '@/utils/clearRouterHistory';

export default function IncomeDetailsScreen() {
    const { id } = useLocalSearchParams();

    const registry = Registry.getInstance();
    const authenticatedUser = registry.getAuthenticatedUser();

    const router = useRouter();


    if (!authenticatedUser) {
        Alert.alert("Error", "You must be logged in to view this income source.");
        clearRouterHistory(router);
        router.replace("/loginPage");
        return null;
    }


    const income = registry.getAllIncomesByUser(authenticatedUser).find(inc => inc.getID() === id);


    if (!income) {
        Alert.alert("Error", "Income source not found.");
        clearRouterHistory(router);
        router.replace("/listTransactionsPage");
        return null;
    }

    setPageTitle(income.title);

    const handleEdit = () => {
        router.navigate("/editIncomePage/" + income.getID());
    }

    const handleDelete = () => {
        Alert.alert('Delete Income', 'Are you sure you want to delete this income source?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
                try {
                    registry.deleteIncome(income.getID());
                    Alert.alert('Success', 'Income source deleted successfully!');
                    clearRouterHistory(router);
                    router.replace("/listTransactionsPage");
                } catch (err: any) {
                    Alert.alert('Error', err.message);
                }
            } },
        ]);
    }

    return (
        <View style={styles.mainContainer}>
            <TopBar />
            <View style={styles.container}>
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
            </View>
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
