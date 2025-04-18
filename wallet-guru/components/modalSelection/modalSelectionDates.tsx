import getMonthName from '@/utils/getMonthName'
import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Pressable, SafeAreaView, Alert } from 'react-native'


interface ModalSelectionProps {
    choices: Array<Date>
    value: Date
    setValue: (text: Date) => void
}

const ModalSelectionDates = (props: ModalSelectionProps) => {

    const [showDropdown, setShowDropdown] = useState<boolean>(false)

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.input} onPress={() => {
                if (props.choices.length > 0) {
                    setShowDropdown(true)
                }
                else {
                    Alert.alert("No Dates", "There are no dates to pick from.")
                }
            }}>
                <TouchableOpacity style={styles.dropdown} onPress={() => {
                    if (props.choices.length > 0) {
                        setShowDropdown(true)
                    }
                    else {
                        Alert.alert("No Dates", "There are no dates to pick from.")
                    }
                }}>
                    <Text style={styles.dropdownText}>{getMonthName(props.value)} {props.value.getFullYear()}</Text>
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
                                        <Text style={styles.optionText}>{getMonthName(item)} {item.getFullYear()}</Text>
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
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        paddingVertical: 20,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        fontSize: 16,
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

export default ModalSelectionDates
