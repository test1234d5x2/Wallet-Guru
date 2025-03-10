import * as SecureStore from "expo-secure-store";


export default async function getEail(): Promise<string | null> {
    const email = await SecureStore.getItemAsync("email");
    return email;
}