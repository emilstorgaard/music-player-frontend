import { userStore } from "$lib/stores/auth";
import { playlistsStore } from "$lib/stores/playlistStore2";

export async function login(email: string, password: string) {
    if (!email || !password) {
        throw new Error("Email og password er påkrævet.");
    }

    const response = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login fejlede");
    }

    return response.json();
}

export async function signup(email: string, password: string, confirmPassword: string) {
    if (!email || !password || !confirmPassword) {
        throw new Error("Email og password er påkrævet.");
    }

    if (password != confirmPassword) {
        throw new Error("Passwords does not match!.");
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const response = await fetch("/api/signup", {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signup fejlede");
    }

    return response.json();
}

export async function logout() {
    const response = await fetch("/api/logout", {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login fejlede");
    }

    userStore.set(null)
    playlistsStore.set([])

    return response.json();
}