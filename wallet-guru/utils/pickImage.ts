import { GoogleGenerativeAI } from '@google/generative-ai';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY

const pickImage = async (setReceipt: (r: string) => void, setDate: (text: Date|null) => void, setAmount: (text: string) => void, setTitle: (text: string) => void, setWaiting: (text: boolean) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery permission is needed to select an image.')
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
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        try {
            setWaiting(true)
            const file = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                encoding: FileSystem.EncodingType.Base64,
            })

            const response = await model.generateContent([
                {
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: file,
                    },
                },
                {
                    text: 'Extract the date, amount, and name of place from this receipt. Respond in JSON format. Do not add anything else to the response. If the data is not available, leave it empty. Return dates in ISO format',
                },
            ])

            const data = response.response.text()
            const cleanedData = data.replace("json", "").replaceAll("```", "")
            const jsonData = JSON.parse(cleanedData)
            setTitle(jsonData.place)
            setAmount(jsonData.amount)
            setDate(new Date(jsonData.date))
            setWaiting(false)
        } catch (error) {
            console.error('Error reading file:', error)
        }
    }
};

export default pickImage;