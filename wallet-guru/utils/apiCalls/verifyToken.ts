export default async function verifyToken(token: string, email: string): Promise<boolean> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const VERIFY_TOKEN_URL = `http://${API_DOMAIN}/api/verify-token`

    const response = await fetch(VERIFY_TOKEN_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return true;
}