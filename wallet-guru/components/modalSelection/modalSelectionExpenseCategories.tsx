import Category from '@/models/core/Category';
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Pressable, SafeAreaView, Alert } from 'react-native';


interface ModalSelectionProps<T extends Category> {
    choices: Array<T>
    value: T | null
    setValue: (text: T) => void
    required?: boolean
}

const ModalSelectionExpenseCategories = (props: ModalSelectionProps<Category>) => {

    const [showDropdown, setShowDropdown] = useState<boolean>(false)
    let displayText = props.value?.name

    return (
        <View style={{ rowGap: 5 }}>
            <TouchableOpacity style={styles.input} onPress={() => {
                if (props.choices.length > 0) {
                    setShowDropdown(true)
                }
                else {
                    Alert.alert("No Expense Categories", "You have not created any expense categories to pick from.")
                }
            }}>
                <TouchableOpacity style={styles.dropdown} onPress={() => {
                    if (props.choices.length > 0) {
                        setShowDropdown(true)
                    }
                    else {
                        Alert.alert("No Expense Categories", "You have not created any expense categories to pick from.")
                    }
                }}>
                    <Text style={styles.dropdownText}>Category: {displayText == undefined ? "" : displayText}</Text>
                </TouchableOpacity>

                <Modal visible={showDropdown} transparent={true} onRequestClose={() => setShowDropdown(false)}>
                    <SafeAreaView style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <FlatList
                                data={props.choices}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.dropdownOption}
                                        onPress={() => {
                                            props.setValue(item);
                                            setShowDropdown(false);
                                        }}
                                    >
                                        <Text style={styles.optionText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                        <Pressable
                            style={styles.modalDismissArea}
                            onPress={() => setShowDropdown(false)}
                        />
                    </SafeAreaView>
                </Modal>
            </TouchableOpacity>
            <Text style={styles.requiredText}>{props.required ? "Required" : "Optional"}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        paddingVertical: 20,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        fontSize: 16,
    },
    requiredText: {
        paddingLeft: 15,
        color: "rgba(0,0,0,0.55)",
        fontSize: 12,
    },
    dropdown: {
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

export default ModalSelectionExpenseCategories
