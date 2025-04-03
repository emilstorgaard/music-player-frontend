import { API_HOST } from "$env/static/private";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST({ request }: RequestEvent) {
    const { email, password } = await request.json();

    try {
        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
            return json({ error: "Ugyldige signup-oplysninger" }, { status: 400 });
        }
    
        const formData = new URLSearchParams();
        formData.append("Email", email);
        formData.append("Password", password);

        const response = await fetch(`${API_HOST}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded" // Required for FormData
            },
            body: formData.toString() // Convert FormData to URL-encoded format
        });

        if (!response.ok) {
            const errorData = await response.json();
            return json({  error: errorData.error || "Signup failed" }, { status: response.status });
        }

        return json({ success: true });
    } catch (error: any) {
        return json({ error: "Internal server error" }, { status: 500 });
    }
}