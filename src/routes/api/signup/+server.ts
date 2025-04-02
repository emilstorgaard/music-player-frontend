import { API_HOST } from "$env/static/private";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST({ request }: RequestEvent) {
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
        return json({ error: "Ugyldige signup-oplysninger" }, { status: 400 });
    }

    // Send login request til C# backend
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const response = await fetch(`${API_HOST}/users/register`, {
        method: "POST",
        body: formData
    });

    console.log(response.status)
    if (!response.ok) {
        const errorData = await response.json();
        return json({ error: errorData.error || "Signup fejlede" }, { status: response.status });
    }
    
    return json({ success: true });
}