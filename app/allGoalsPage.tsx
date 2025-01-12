import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Text } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';
import GoalItem from '@/components/listItems/goalItem';
import { Link, useRouter } from 'expo-router';
import Registry from '@/models/data/Registry';
import clearRouterHistory from '@/utils/clearRouterHistory';

export default function AllGoals() {
    setPageTitle("All Goals");

    const [selectedSort, setSelectedSort] = useState<string>("");
    const router = useRouter();

    const registry = Registry.getInstance();
    const authService = registry.authService;
    const goalService = registry.goalService;

    const user = authService.getAuthenticatedUser();

    if (!user) {
        Alert.alert('Error', 'You must be logged in to view all your goals.');
        clearRouterHistory(router);
        router.replace("/loginPage");
        return;
    }

    const goals = [...goalService.getAllGoalsByUser(user)];

    const handleGoalClick = (id: string) => {
        router.navigate(`/viewGoalDetailsPage/${id}`);
    };

    const displayElements = goals.map((goal) => (
        <React.Fragment key={uuid.v4()}>
            <TouchableOpacity onPress={() => handleGoalClick(goal.getID())}>
                <GoalItem goal={goal} />
            </TouchableOpacity>
            <View style={styles.divider} />
        </React.Fragment>
    ));

    return (
        <View style={styles.container}>
            <TopBar />
            <ScrollView contentContainerStyle={{ rowGap: 30 }}>
                {displayElements.length > 0 ? displayElements :
                    <View style={styles.messageContainer}>
                        <Text style={styles.message}>There are currently no goals. </Text>
                        <TouchableOpacity>
                            <Link href="/addGoalPage" replace>
                                <Text style={styles.linkText}>Add a goal</Text>
                            </Link>
                        </TouchableOpacity>
                    </View>
                }
            </ScrollView>
        </View>
    );
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
    linkText: {
        fontSize: 16,
        color: "#007BFF",
        textDecorationLine: "underline",
    },
    messageContainer: {
        alignItems: "center",
        rowGap: 10,
    },
    message: {
        textAlign: "center",
        fontSize: 16,
    }
});
