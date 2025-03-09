import path from "path";
import tesseract from 'node-tesseract-ocr';

export default async function extractTextFromReceipt() {
    const imagePath = path.join(__dirname, '..', 'images', 'test-image.jpg');
    const config = {
        lang: 'eng',
        oem: 1,
        psm: 3
    };
    const text = await tesseract.recognize(imagePath, config);
    console.log(text)
}