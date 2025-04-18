import RecurrencePeriod from '@/enums/Frequency'
import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Pressable, SafeAreaView } from 'react-native'


interface ModalSelectionProps {
    choices: Array<RecurrencePeriod>
    value: RecurrencePeriod | null
    setValue: (text: RecurrencePeriod) => void
    required?: boolean
}

const ModalSelectionRecurrencePeriods = (props: ModalSelectionProps) => {

    const [showDropdown, setShowDropdown] = useState<boolean>(false)
    let displayText = props.value

    return (
        <View>
            <TouchableOpacity style={styles.input}>
                <TouchableOpacity style={styles.dropdown} onPress={() => { setShowDropdown(true) }}>
                    <Text style={styles.dropdownText}>Frequency Period: {displayText == undefined ? "" : displayText}</Text>
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

export default ModalSelectionRecurrencePeriods
