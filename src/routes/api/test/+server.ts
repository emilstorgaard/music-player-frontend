import { json, type RequestEvent } from "@sveltejs/kit";

import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { emailTest, passwordTest } = await request.json();

    try {
        const formData = new URLSearchParams();
        formData.append("Email", emailTest);
        formData.append("Password", passwordTest);

        const csharpApiResponse = await fetch("https://music.emilstorgaard.dk/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded" // Required for FormData
            },
            body: formData.toString() // Convert FormData to URL-encoded format
        });

        if (!csharpApiResponse.ok) {
            const errorData = await csharpApiResponse.json();
            return new Response(JSON.stringify({ error: errorData.message || "Login failed" }), {
                status: csharpApiResponse.status,
                headers: { "Content-Type": "application/json" }
            });
        }

        const data = await csharpApiResponse.json();

        const { token } = data

        console.log("token", token)

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
};