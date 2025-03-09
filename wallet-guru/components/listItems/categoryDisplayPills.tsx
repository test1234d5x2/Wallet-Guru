import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type PillProps = {
    colour: string;
    text: string;
};

export const StrongPill: React.FC<PillProps> = ({ colour, text }) => {
    return (
        <View style={[strongStyles.pill, { backgroundColor: colour }]}>
            <Text style={strongStyles.text}>{text}</Text>
        </View>
    );
};

const strongStyles = StyleSheet.create({
    pill: {
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 12,
        alignSelf: 'flex-start',
        margin: 4,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: "bold",
    },
});


export const Pill: React.FC<PillProps> = ({colour, text}) => {
    return (
        <View style={[styles.pill, { backgroundColor: colour }]}>
            <Text style={styles.text}>Category: {text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    pill: {
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 12,
        alignSelf: 'flex-start',
        margin: 4,
    },
    text: {
        color: '#fff',
        fontSize: 14,
    },
});