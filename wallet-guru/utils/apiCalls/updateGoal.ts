export default async function updateGoal(token: string, id: string, current: number): Promise<boolean> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const UPDATE_GOAL_PROGRESS_URL = `http://${API_DOMAIN}/api/goals/${id}/progress`

    const response = await fetch(UPDATE_GOAL_PROGRESS_URL, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            current
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return true;
}