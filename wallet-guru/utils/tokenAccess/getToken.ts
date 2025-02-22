import * as SecureStore from "expo-secure-store";
import TokenEmailCombo from "@/models/token/tokenEmailCombo";

/**
 * Retrieve the JWT token securely
 * @returns {Promise<string | null>} - The retrieved token or null if not found
 */
export default async function getToken(): Promise<TokenEmailCombo | null> {
    const token = await SecureStore.getItemAsync("jwtToken");
    const email = await SecureStore.getItemAsync("email");
    if (token && email) {
        return {token, email}
    }
    return null;
}
