export default async function changeUserPassword(token: string, email: string, newPassword: string): Promise<boolean> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const CHANGE_USER_PASSWORD = `http://${API_DOMAIN}/api/users/changePassword`;

    const response = await fetch(CHANGE_USER_PASSWORD, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            newPassword
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    };

    return true;
}