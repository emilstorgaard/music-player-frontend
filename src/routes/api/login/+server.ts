import { API_HOST } from "$env/static/private";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST({ request, cookies }: RequestEvent) {
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
        return json({ error: "Ugyldige login-oplysninger" }, { status: 400 });
    }

    // Send login request til C# backend
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const response = await fetch(`${API_HOST}/auth/login`, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        return json({ error: errorData.error || "Login fejlede" }, { status: response.status });
    }

    const { token } = await response.json();

    // Sæt JWT som en HttpOnly cookie i SvelteKit serveren
    cookies.set("jwt", token, {
        path: "/",
        httpOnly: true,  // Beskytter mod XSS
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 time
    });

    return json({ success: true });
}