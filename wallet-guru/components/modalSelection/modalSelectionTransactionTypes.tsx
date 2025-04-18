import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Pressable, SafeAreaView, Alert, } from 'react-native'
import TransactionType
 from '@/enums/TransactionType'

interface ModalSelectionProps {
    choices: Array<TransactionType>
    value: TransactionType | null
    setValue: (type: TransactionType) => void
}

const ModalSelectionTransactionTypes = (props: ModalSelectionProps) => {
    const [showDropdown, setShowDropdown] = useState<boolean>(false)

    return (
        <View>
            <TouchableOpacity
                style={styles.input}
                onPress={() => {
                    if (props.choices.length > 0) {
                        setShowDropdown(true)
                    } else {
                        Alert.alert('No Transaction Types', 'There are no transaction types to pick from.')
                    }
                }}
            >
                <Text style={styles.dropdownText}>Transaction Type: {props.value !== null ? props.value: ""}</Text>
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
                                        props.setValue(item)
                                        setShowDropdown(false)
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
    input: {
        paddingVertical: 20,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    dropdownText: {
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        elevation: 5,
        zIndex: 1000,
        borderRadius: 10,
    },
    modalDismissArea: {
        position: 'absolute',
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

export default ModalSelectionTransactionTypes
