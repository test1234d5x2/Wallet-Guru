import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Pressable, SafeAreaView } from 'react-native'


interface ModalSelectionProps {
    choices: Array<string>
    value: string | null
    setValue: (text: string) => void
    required?: boolean
}

// Colour selection using a modal.
const ModalSelectionColours = (props: ModalSelectionProps) => {

    const [showDropdown, setShowDropdown] = useState<boolean>(false)

    return (
        <View style={{rowGap: 5}}>
            <TouchableOpacity style={styles.input} onPress={() => { setShowDropdown(true) }}>
                <TouchableOpacity style={styles.dropdown} onPress={() => { setShowDropdown(true) }}>
                    <View style={styles.row}>
                        <Text style={styles.dropdownText}>Colour:</Text>
                        <View style={[styles.circle, { backgroundColor: props.value || 'white' }]} />
                    </View>
                </TouchableOpacity>

                <Modal visible={showDropdown} transparent={true} onRequestClose={() => setShowDropdown(false)}>
                    <SafeAreaView style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <FlatList
                                contentContainerStyle={styles.choicesContainer}
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
                                        <View style={[styles.circle, { backgroundColor: item }]} />
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginLeft: 8,
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
    choicesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center"
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
        borderRightWidth: 1,
        borderColor: '#ccc',
    },
    optionText: {
        fontSize: 16,
    },
})

export default ModalSelectionColours
