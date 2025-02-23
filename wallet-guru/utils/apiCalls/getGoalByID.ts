import Goal from "@/models/core/Goal";

export default async function getGoalByID(token: string, id: string): Promise<Goal> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const GET_GOAL_URL = `http://${API_DOMAIN}/api/goals/${id}`;

    const response = await fetch(GET_GOAL_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    };

    const data: any = await response.json();
    return new Goal(data.title, data.userID, data.description, data.target, data.status, data.id);
}