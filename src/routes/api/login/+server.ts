import { API_HOST } from "$env/static/private";
import type { RequestEvent } from "@sveltejs/kit";
// import type { RequestHandler } from '@sveltejs/kit';

export async function POST({ request, cookies }: RequestEvent) {
    const { email, password } = await request.json();

    try {
        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
            return new Response(JSON.stringify({ error: "Ugyldige login-oplysninger" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const formData = new URLSearchParams();
        formData.append("Email", email);
        formData.append("Password", password);

        const response = await fetch(`${API_HOST}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded" // Required for FormData
            },
            body: formData.toString() // Convert FormData to URL-encoded format
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            return new Response(JSON.stringify({ error: errorData.error || "Login failed" }), {
                status: response.status,
                headers: { "Content-Type": "application/json" }
            });
        }

        const data = await response.json();

        const { token } = data

        // Sæt JWT som en HttpOnly cookie i SvelteKit serveren
        cookies.set("jwt", token, {
            path: "/",
            httpOnly: true,  // Beskytter mod XSS
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60, // 1 time
        });

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}