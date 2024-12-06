import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Pressable, SafeAreaView } from 'react-native';
import setPageTitle from '@/components/pageTitle/setPageTitle';


interface ModalSelectionProps {
    choices: Array<string>
    value: string
    setValue: (text: string) => void
}

const ModalSelection = (props: ModalSelectionProps) => {
    setPageTitle('Flat List Test');

    const [showDropdown, setShowDropdown] = useState<boolean>(false)

    const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowDropdown(true)}>
                <Text style={styles.dropdownText}>{props.value}</Text>
            </TouchableOpacity>

            <Modal visible={showDropdown} transparent={true} onRequestClose={() => setShowDropdown(false)}>
                <SafeAreaView style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <FlatList
                            data={categories}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.dropdownOption}
                                    onPress={() => {
                                        props.setValue(item);
                                        setShowDropdown(false);
                                    }}
                                >
                                    <Text style={styles.optionText}>{item}</Text>
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
        </View>
    )
}

const styles = StyleSheet.create({
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

export default ModalSelection;
