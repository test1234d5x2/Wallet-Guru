import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';
import TopBar from '@/components/topBars/topBar';


export default function ViewTransactionsList() {

    setPageTitle("View Transactions")

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
        minHeight: Dimensions.get("window").height,
        rowGap: 20,
    },
});