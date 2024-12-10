import React from 'react';
import { View, StyleSheet } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';


export default function Analytics() {

    setPageTitle("Spending Analytics")

    return (
        <View style={styles.container}>
            <TopBar />
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
});