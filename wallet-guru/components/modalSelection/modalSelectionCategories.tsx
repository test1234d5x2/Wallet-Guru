import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Pressable, SafeAreaView, Alert } from 'react-native'
import Category from '@/models/core/Category'
import ExpenseCategory from '@/models/core/ExpenseCategory'
import IncomeCategory from '@/models/core/IncomeCategory'

interface ModalSelectionProps<T extends Category> {
    choices: T[]
    value: T | null
    setValue: (item: T) => void
    required?: boolean
}

export function ModalSelectionCategories<T extends Category>(props: ModalSelectionProps<T>, label: string) {
    const [showDropdown, setShowDropdown] = useState<boolean>(false)
    const displayText = props.value?.name || ''

    const handleOpen = () => {
        if (props.choices.length > 0) {
            setShowDropdown(true)
        } else {
            Alert.alert(`No ${label} Categories`,  `You have not created any ${label.toLowerCase()} categories to pick from.`
            )
        }
    }

    return (
        <View style={{ rowGap: 5 }}>
            <TouchableOpacity style={styles.input} onPress={handleOpen}>
                <View style={styles.dropdown}>
                    <Text style={styles.dropdownText}>
                        {label} Category: {displayText}
                    </Text>
                </View>
            </TouchableOpacity>

            <Modal
                visible={showDropdown}
                transparent={true}
                onRequestClose={() => setShowDropdown(false)}
            >
                <SafeAreaView style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <FlatList
                            data={props.choices}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.dropdownOption}
                                    onPress={() => {
                                        props.setValue(item)
                                        setShowDropdown(false)
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

            <Text style={styles.requiredText}>
                {props.required ? 'Required' : 'Optional'}
            </Text>
        </View>
    )
}

export function ModalSelectionExpenseCategories(props: ModalSelectionProps<ExpenseCategory>) {
    let display = ModalSelectionCategories<ExpenseCategory>(props, "Expense")
    return display
}

export function ModalSelectionIncomeCategories(props: ModalSelectionProps<IncomeCategory>) {
    let display = ModalSelectionCategories<IncomeCategory>(props, "Income")
    return display
}

const styles = StyleSheet.create({
    input: {
        paddingVertical: 20,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        fontSize: 16
    },
    requiredText: {
        paddingLeft: 15,
        color: 'rgba(0,0,0,0.55)',
        fontSize: 12
    },
    dropdown: {
        backgroundColor: '#fff'
    },
    dropdownText: {
        fontSize: 16
    },
    modalOverlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        elevation: 5,
        zIndex: 1000
    },
    modalDismissArea: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0
    },
    dropdownOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    optionText: {
        fontSize: 16
    }
})
