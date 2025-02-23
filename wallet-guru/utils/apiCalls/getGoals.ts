import Goal from "@/models/core/Goal";

export default async function getGoals(token: string): Promise<Goal[]> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const GET_GOALS_URL = `http://${API_DOMAIN}/api/goals`;

    const response = await fetch(GET_GOALS_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    const data = await response.json();
    const goals: Goal[] = data.goals.map((goal: any) => new Goal(goal.title, goal.userID, goal.description, goal.target, goal.status, goal.id));
    return goals;
}