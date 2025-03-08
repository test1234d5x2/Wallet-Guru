import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ColorPickerModal from '@/components/modalSelection/modalSelectionColours';

export default function ColourPicker() {
    const [colour, setColour] = useState<string | null>(null)

    const colours = [
        '#000000', // Black
        '#400000', // Dark Red
        '#FF0000', // Red
        '#FF4500', // Dark Orange
        '#FFA500', // Orange
        '#FFD700', // Yellow-Orange
        '#FFFF00', // Yellow
        '#ADFF2F', // Yellow-Green
        '#008000', // Green
        '#008080', // Teal/Cyan-Green
        '#00FFFF', // Cyan
        '#007FFF', // Azure
        '#0000FF', // Blue
        '#4B0082', // Indigo
        '#8A2BE2', // Violet
        '#FF00FF', // Magenta
        '#FF69B4', // Hot Pink
        '#FFB6C1', // Light Pink
        '#D3D3D3', // Light Gray
      ];
      
      

    return (
        <View style={{backgroundColor: "white"}}>
            <ColorPickerModal value={colour} setValue={setColour} choices={colours} />
        </View>
    )
}