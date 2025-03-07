import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Text, StatusBar } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';
import uuid from 'react-native-uuid';
import GoalItem from '@/components/listItems/goalItem';
import { Link, useRouter } from 'expo-router';
import clearRouterHistory from '@/utils/clearRouterHistory';
import getToken from '@/utils/tokenAccess/getToken';
import Goal from '@/models/core/Goal';
import getGoals from '@/utils/apiCalls/getGoals';

export default function AllGoals() {
    setPageTitle("All Goals");

    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [selectedSort, setSelectedSort] = useState<string>("");
    const [goals, setGoals] = useState<Goal[]>([]);


    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to access this page.');
            clearRouterHistory(router);
            router.replace("/loginPage");
            return;
        }

        setToken(data.token);
    });

    useEffect(() => {
        async function getGoalsList() {
            const result = await getGoals(token);
            if (result) {
                setGoals(result);
            } else {
                console.log("Error with getting goals list")
            }
        }

        if (token) getGoalsList();
    }, [token]);

    const handleGoalClick = (id: string) => {
        clearRouterHistory(router);
        router.navigate(`/viewGoalDetailsPage/${id}`);
    };

    
    const displayElements = goals.map((goal) => (
        <React.Fragment key={uuid.v4()}>
            <TouchableOpacity onPress={() => handleGoalClick(goal.getID())}>
                <GoalItem token={token} goal={goal} />
            </TouchableOpacity>
            <View style={styles.divider} />
        </React.Fragment>
    ));

    return (
        <View style={styles.container}>
            <StatusBar barStyle={"dark-content"} />
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
