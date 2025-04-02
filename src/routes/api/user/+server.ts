import { API_HOST } from "$env/static/private";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function GET({ locals }: RequestEvent) {
    const response = await fetch(`${API_HOST}/users/authorized`, {
        method: "GET",
        headers: { 'Authorization': `Bearer ${locals.user?.jwt}` }
    });

    if (!response.ok) {
        const errorData = await response.json();
        return json({ error: errorData.error || "Error getting userData" }, { status: response.status });
    }

    const userData = await response.json();

    return json({ user: userData, jwt: locals.user?.jwt });
}