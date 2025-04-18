import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

type PillProps = {
    colour: string
    text: string
}

const getTextColor = (bgColor: string): string => {
    const hex = bgColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    return luminance > 0.5 ? '#000' : '#fff'
}

export const StrongPill: React.FC<PillProps> = ({ colour, text }) => {
    const textColor = getTextColor(colour)

    return (
        <View style={[strongStyles.pill, { backgroundColor: colour }]}>
            <Text style={[strongStyles.text, { color: textColor }]}>{text}</Text>
        </View>
    )
}

const strongStyles = StyleSheet.create({
    pill: {
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 12,
        alignSelf: 'flex-start',
        margin: 4
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold'
    }
})

export const Pill: React.FC<PillProps> = ({ colour, text }) => {
    const textColor = getTextColor(colour)

    return (
        <View style={[styles.pill, { backgroundColor: colour }]}>
            <Text style={[styles.text, { color: textColor }]}>Category: {text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    pill: {
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 12,
        alignSelf: 'flex-start',
        margin: 4
    },
    text: {
        fontSize: 14
    }
})
