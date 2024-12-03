import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

import MenuItem from './menuItem';


const styles = StyleSheet.create({
    container: {
        rowGap: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    iconButton: {
        padding: 5,
    },
});


export default function MenuTopBar() {

    return (
        <View style={styles.container}>
            <View>
                <TouchableOpacity style={styles.iconButton}>
                    <Link href={"/"}>
                        <Ionicons name="close" size={28} color="black" />
                    </Link>
                </TouchableOpacity>
            </View>
            
            
        </View>
    );
};
