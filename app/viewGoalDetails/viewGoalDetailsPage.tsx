import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';


export default function ViewGoalDetails() {

    setPageTitle("Goal Title")

    const handleUpdateProgress = () => {
        console.log("Update Progress clicked")
    };

    const handleDeleteGoal = () => {
        console.log("Delete Goal clicked")
    };


    return (
        <View style={styles.container}>
            <TopBar />

            <Text style={styles.label}>Target: £2500</Text>

            <View style={{rowGap: 5}}>
                <Text style={styles.label}>Current: £1000</Text>
                <Progress.Bar progress={0.4} color="#007BFF" width={null} />
            </View>

            <Text style={styles.label}>Deadline: 05/2025</Text>

            <Text style={styles.label}>Notes: Lorum ipsum dolor sit amet.</Text>

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.editButton} onPress={handleUpdateProgress}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteGoal}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
        rowGap: 30,
    },
    label: {
        fontSize: 16,
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
      },
      editButton: {
        flex: 1,
        backgroundColor: "#007BFF",
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: "center",
        marginHorizontal: 10,
        marginLeft: 0,
      },
      deleteButton: {
        flex: 1,
        backgroundColor: "#FF4C4C",
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: "center",
        marginHorizontal: 10,
        marginRight: 0,
      },
      buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      },
});