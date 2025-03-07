import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

const App: React.FC = () => {
    const [selectedColor, setSelectedColor] = useState('#ffffff');

    const handleColorChange = (color: string) => {
        setSelectedColor(color);
    };

    return (
        <View style={styles.container}>
            <Text>{selectedColor}</Text>
            <ColorPicker
                color={selectedColor}
                onColorChangeComplete={handleColorChange}
                wheelHidden={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        rowGap: 30
    },
});

export default App;
