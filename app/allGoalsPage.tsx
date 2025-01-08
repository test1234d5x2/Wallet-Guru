import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';
import GoalItem from '@/components/listItems/goalItem';
import { useRouter } from 'expo-router';
import Registry from '@/models/Registry';

export default function AllGoals() {

    setPageTitle("All Goals")

    const [selectedSort, setSelectedSort] = useState<string>("")
    const router = useRouter()
    const registry = Registry.getInstance()
    const user = registry.getAuthenticatedUser()

    if (!user) {
        router.replace("/loginPage")
        return null
    }

    const goals = registry.getAllGoalsByUser(user)

    const handleGoalClick = (id: string) => {
        router.navigate(`/viewGoalDetailsPage?id=${id}`)
    }

    const handleNoGoals = () => {
        Alert.alert("No Goals", "You currently have no goals set.")
    }

    let displayElements = []

    if (goals.length === 0) {
        handleNoGoals()
    } else {
        for (let goal of goals) {
            displayElements.push(
                <TouchableOpacity key={uuid.v4()} onPress={() => handleGoalClick(goal.getID())}>
                    <GoalItem goal={goal} />
                </TouchableOpacity>
            )
            displayElements.push(<View style={styles.divider} key={uuid.v4()} />)
        }
    }

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
    divider: {
        height: 1,
        backgroundColor: "#ccc",
    },
})
