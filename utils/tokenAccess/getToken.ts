import * as SecureStore from "expo-secure-store";

/**
 * Retrieve the JWT token securely
 * @returns {Promise<string | null>} - The retrieved token or null if not found
 */
export default async function getToken(): Promise<string | null> {
    const token = await SecureStore.getItemAsync("jwtToken");
    return token;
}
