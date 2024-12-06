import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Pressable, SafeAreaView } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';



const FlatListDropdown = () => {
    setPageTitle('Flat List Test');

    const [selectedCategory, setSelectedCategory] = useState<string>('Select Category')
    const [showDropdown, setShowDropdown] = useState<boolean>(false)

    const categories = ['Select Category', 'Food', 'Transport', 'Shopping', 'Bills', 'Other'];

    for (let x = 0; x < 2; x++) {
        categories.push(...categories)
    }

    return (
        <View style={flatListStyles.container}>
            <TouchableOpacity style={flatListStyles.dropdown} onPress={() => setShowDropdown(true)}>
                <Text style={flatListStyles.dropdownText}>{selectedCategory}</Text>
            </TouchableOpacity>

            <Modal visible={showDropdown} transparent={true} onRequestClose={() => setShowDropdown(false)}>
                <SafeAreaView style={flatListStyles.modalOverlay}>
                    <View style={flatListStyles.modalContainer}>
                        <FlatList
                            data={categories}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={flatListStyles.dropdownOption}
                                    onPress={() => {
                                        setSelectedCategory(item);
                                        setShowDropdown(false);
                                    }}
                                >
                                    <Text style={flatListStyles.optionText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <Pressable
                        style={flatListStyles.modalDismissArea}
                        onPress={() => setShowDropdown(false)}
                    />
                </SafeAreaView>
            </Modal>
        </View>
    )
}

const flatListStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    dropdown: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    dropdownText: {
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        elevation: 5,
        zIndex: 1000,
    },
    modalDismissArea: {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
    },
    dropdownOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    optionText: {
        fontSize: 16,
    },
})

export default FlatListDropdown;
