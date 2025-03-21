import { GoogleGenerativeAI } from '@google/generative-ai';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

const GEMINI_API_KEY = "AIzaSyBtYKPEFwQZUELp9_I065_J5NX26l_etE8"

const pickImage = async (setReceipt: (r: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery permission is needed to select an image.');
        return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
    });

    if (!result.canceled) {
        setReceipt(result.assets[0].uri);

        const genAI = new GoogleGenerativeAI(`${GEMINI_API_KEY}`)
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" })

        try {
            const file = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            console.log('Base64 Image:', file);
        } catch (error) {
            console.error('Error reading file:', error);
        }
    }
};

export default pickImage;