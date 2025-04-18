import * as SecureStore from "expo-secure-store"
import TokenEmailCombo from "@/models/token/tokenEmailCombo"


export default async function getToken(): Promise<TokenEmailCombo | null> {
    const token = await SecureStore.getItemAsync("jwtToken")
    const email = await SecureStore.getItemAsync("email")
    if (token && email) {
        return {token, email}
    }
    return null
}
