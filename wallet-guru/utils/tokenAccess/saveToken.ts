import * as SecureStore from "expo-secure-store";


export default async function saveToken(token: string, email: string): Promise<void> {
    await SecureStore.setItemAsync("jwtToken", token, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
    await SecureStore.setItemAsync("email",  email, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY })
}

