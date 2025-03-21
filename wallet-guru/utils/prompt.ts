import { GoogleGenerativeAI } from '@google/generative-ai'
import * as FileSystem from 'expo-file-system';

const GEMINI_API_KEY = "AIzaSyBtYKPEFwQZUELp9_I065_J5NX26l_etE8"

export default async function testRun() {
    const genAI = new GoogleGenerativeAI(`${GEMINI_API_KEY}`)
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" })

    const fileUri = FileSystem.documentDirectory + '../images/test-image.jpg';

    try {
        const file = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        console.log('Base64 Image:', file);
    } catch (error) {
        console.error('Error reading file:', error);
    }

}