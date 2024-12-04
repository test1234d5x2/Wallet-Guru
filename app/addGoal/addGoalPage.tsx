import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import GoalDetailsInputs from '@/components/formComponents/goalDetailsInputs';


export default function AddGoal() {

    setPageTitle("Add Goal")

    const [title, setTitle] = useState<string>('')
    const [target, setTarget] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [notes, setNotes] = useState<string>('')
    const [error, setError] = useState<string>('')

    const handleAddGoal = () => {
        if (!title || !target || !date) {
            Alert.alert('Please fill in all required fields.');
            setError("Fill in all the required fields.")
            return;
        }

        Alert.alert('Success', 'Goal added successfully!');
        return
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TopBar />

            <View style={styles.goalForm}>
                <GoalDetailsInputs 
                    title={title}
                    target={target}
                    date={date}
                    notes={notes}
                    setTitle={setTitle}
                    setTarget={setTarget}
                    setDate={setDate}
                    setNotes={setNotes}
                />
            </View>

            {error ? <View style={styles.centeredTextContainer}><Text style={styles.errorText}>{error}</Text></View> : null}
            

            <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
                <Text style={styles.addButtonText}>Add Goal</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        display: "flex",
        rowGap: 20,
        padding: 20,
        backgroundColor: '#fff',
        minHeight: Dimensions.get("window").height,
    },
    goalForm: {
        marginBottom: 40,
    },
    scanText: {
        color: '#777',
        textDecorationLine: 'underline',
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    centeredTextContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: 'red',
        fontSize: 14,
    },
})