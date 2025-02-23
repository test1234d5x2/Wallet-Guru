import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

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
    }
};

export default pickImage;