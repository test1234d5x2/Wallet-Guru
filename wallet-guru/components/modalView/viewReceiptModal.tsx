import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, View, Image, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';

interface Props {
    uri: string;
    visible: boolean;
    setViewReceipt: (b: boolean) => void;
}

export default function ViewReceiptModal({ uri, visible, setViewReceipt }: Props) {
    return (
        <Modal visible={visible} transparent={true} onRequestClose={() => setViewReceipt(false)}>
            <View style={styles.modalContainer}>
                <TouchableOpacity onPress={() => setViewReceipt(false)} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContentContainer}
                    maximumZoomScale={3}
                    minimumZoomScale={1}
                    centerContent={true}
                >
                    <Image source={{ uri }} style={styles.fullImage} />
                </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
        padding: 10,
    },
    closeText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
});
