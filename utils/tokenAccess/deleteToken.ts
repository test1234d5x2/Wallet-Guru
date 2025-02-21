import * as SecureStore from "expo-secure-store";

/**
 * Remove JWT token securely
 */
export default async function removeToken(): Promise<void> {
    try {
        await SecureStore.deleteItemAsync("jwtToken");
        console.log("Token removed successfully.");
    } catch (error) {
        console.error("Error removing the token:", error);
    }
}
