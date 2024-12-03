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
    menuContainer: {
        display: "flex",
        flexDirection: "column",
        rowGap: 20,
    },
    iconButton: {
        padding: 5,
    },
});


export default function MenuTopBar() {

    const menuItems = [
        {title: 'Add Expense'},
        {title: 'Add Income'},
        {title: 'Transaction History'},
        {title: 'Create A New Goal'},
        {title: 'View Goals'},
        {title: 'Create An Expense Category'},
        {title: 'Expense Category Overview'},
        {title: 'Spending Analytics'},
      ];

    return (
        <View style={styles.container}>
            <View>
                <TouchableOpacity style={styles.iconButton}>
                    <Link href={"/login"}>
                        <Ionicons name="close" size={28} color="black" />
                    </Link>
                </TouchableOpacity>
            </View>
            
            <View style={styles.menuContainer}>
                {menuItems.map((item) => {return <MenuItem key={item.title} title={item.title} />})}
            </View>

            <View>
                <Text>Log Out</Text>
                <Text>This needs to be displayed at the bottom.</Text>
            </View>
        </View>
    );
};
