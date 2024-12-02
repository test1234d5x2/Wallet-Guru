import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
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
                <Ionicons name="menu" size={28} color="black" />
            </TouchableOpacity>

            <Text style={styles.title}>A Page</Text>

            <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="person-circle-outline" size={28} color="black" />
            </TouchableOpacity>
        </View>
    )
}  