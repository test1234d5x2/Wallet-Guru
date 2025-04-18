export default async function deleteUser(token: string, email: string): Promise<boolean> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.")
    }

    const DELETE_USER_URL = `http://${API_DOMAIN}/api/users/delete`

    const response = await fetch(DELETE_USER_URL, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email
        })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }

    return true
}