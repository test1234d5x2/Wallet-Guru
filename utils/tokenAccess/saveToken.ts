import * as SecureStore from "expo-secure-store";

/**
 * Save a JWT token securely
 * @param {string} token - JWT token to store
 */
export default async function saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync("jwtToken", token, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
}

