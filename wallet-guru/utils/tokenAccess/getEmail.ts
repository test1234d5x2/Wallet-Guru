import * as SecureStore from "expo-secure-store";

/**
 * Retrieve the email securely
 * @returns {Promise<string | null>} - The retrieved email or null if not found
 */
export default async function getEail(): Promise<string | null> {
    const email = await SecureStore.getItemAsync("email");
    return email;
}