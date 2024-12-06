import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';



// This might replace the Picker in the add expense and edit expense section.
// This needs to be turned into a modal since absolute positioning on the dropdown container is not going to be a good idea.

const AddExpenseScreen = () => {

    setPageTitle("Flat List Test")

    const [selectedCategory, setSelectedCategory] = useState<string>('Select Category');
    const [showDropdown, setShowDropdown] = useState(false);

    const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];

    return (
        <View style={flatListStyles.container}>
            <TouchableOpacity
                style={flatListStyles.dropdown}
                onPress={() => setShowDropdown(!showDropdown)}
            >
                <Text style={flatListStyles.dropdownText}>{selectedCategory}</Text>
            </TouchableOpacity>

            {showDropdown && (
                <View style={[flatListStyles.dropdownContainer, flatListStyles.dropdownZIndex]}>
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
            )}
        </View>
    );
};

const flatListStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
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
    dropdownContainer: {
        position: "absolute",
        top: 70, 
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        margin: 15,
        marginTop: 0,
    },
    dropdownZIndex: {
        zIndex: 1000,
        elevation: 5,
    },
    dropdownOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    optionText: {
        fontSize: 16,
    },
});

export default AddExpenseScreen;
