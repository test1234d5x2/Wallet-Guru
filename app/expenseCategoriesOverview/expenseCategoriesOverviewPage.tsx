import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';


export default function ViewExpenseCategories() {

    setPageTitle("Expense Categories")

    const categories = [
        { id: "1", name: "Category Name", spending: 400, budget: 1000, progress: 0.4 },
        { id: "2", name: "Category Name", spending: 400, budget: 1000, progress: 0.4 },
    ]

    const handleEditCategory = (id: string) => {
        console.log(`Edit category with ID: ${id}`)
    }

    const handleDeleteCategory = (id: string) => {
        console.log(`Delete category with ID: ${id}`)
    }

    let displayElements = []

    for (let category of categories) {
        displayElements.push(
            <View key={uuid.v4()} style={styles.categoryContainer}>
                <Text style={styles.categoryName}>{category.name}</Text>

                <Text style={styles.label}>Spending: £{category.spending}</Text>
                <Progress.Bar progress={category.progress} color="#007BFF" width={null} />
                <Text style={styles.label}>Budget: £{category.budget}</Text>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEditCategory(category.id)}>
                        <Ionicons name="pencil-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteCategory(category.id)}>
                        <Ionicons name="trash-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        )

        displayElements.push(<View style={styles.divider} key={uuid.v4()} />)
    }


    return (
        <View style={styles.container}>
            <TopBar />

            {displayElements}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
        rowGap: 20,
    },
    categoryContainer: {
        rowGap: 10,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    label: {
        fontSize: 14,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
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
        justifyContent: "center",
    },
    deleteButton: {
        backgroundColor: "#FF4C4C",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
    },
})