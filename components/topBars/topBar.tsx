import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    iconButton: {
        padding: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
});



export default function TopBar() {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.iconButton}>
                <Link href={"/menu/menuPage"}>
                    <Ionicons name="menu" size={28} color="black" />                
                </Link>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
                <Link href={"/accountOverview/accountOverviewPage"}>
                    <Ionicons name="person-circle-outline" size={28} color="black" />
                </Link>
            </TouchableOpacity>
        </View>
    )
}  