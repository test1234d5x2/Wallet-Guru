import * as FileSystem from 'expo-file-system'

export default async function saveFile(filename: string, contents: string) {
    try {
        const perm = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
        if (perm.granted && perm.directoryUri) {
            const uri = await FileSystem.StorageAccessFramework.createFileAsync(
                perm.directoryUri,
                filename,
                'application/x-qif'
            )
            await FileSystem.StorageAccessFramework.writeAsStringAsync(
                uri,
                contents,
                { encoding: FileSystem.EncodingType.UTF8 }
            )
            return uri
        }
    } catch (e) {
        console.warn('Error requesting directory or writing file:', e)
    }
}