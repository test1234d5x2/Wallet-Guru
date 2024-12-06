import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';

export default function AllGoals() {

    setPageTitle("All Goals")

    const [selectedSort, setSelectedSort] = useState<string>("")

    const goals = [
        { id: "1", title: "Goal Title", target: 2500, progress: 0.4 },
        { id: "2", title: "Goal Title", target: 2500, progress: 0.6 },
        { id: "3", title: "Goal Title", target: 2500, progress: 0.8 },
    ];

    let displayElements = []

    for (let goal of goals) {
        displayElements.push(
            <View key={goal.id} style={styles.goalContainer}>
                <View style={styles.goalHeader}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalTarget}>Target: £{goal.target}</Text>
                </View>
                <Text style={styles.progressLabel}>Progress</Text>
                <Progress.Bar progress={goal.progress} color="#007BFF" width={null} />
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(goal.id)}>
                        <Ionicons name="pencil-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(goal.id)}>
                        <Ionicons name="trash-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        )
        displayElements.push(<View style={styles.divider} key={Math.random().toString()} />)
    }

    const handleEdit = (id: string) => {
        console.log(`Edit goal with ID: ${id}`)
    };

    const handleDelete = (id: string) => {
        console.log(`Delete goal with ID: ${id}`)
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TopBar />

            {displayElements}
            
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
        rowGap: 30,
    },
    goalContainer: {
        rowGap: 15,
    },
    goalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    goalTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    goalTarget: {
        fontSize: 16,
    },
    progressLabel: {
        fontSize: 14,
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    editButton: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    deleteButton: {
        backgroundColor: "#FF4C4C",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
    },

});