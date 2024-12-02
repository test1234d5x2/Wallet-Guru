import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    iconButton: {
        padding: 5,
    },
});


export default function MenuTopBar() {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>
        </View>
    );
};
