import { userStore } from "$lib/stores/auth";
import { playlistsStore, selectedPlaylistStore, selectedPlaylistSongsStore, selectedPlaylistSongStore } from "$lib/stores/playlistStore";
import { currentSong } from "$lib/stores/songStore";
import { setCookie, deleteCookie } from "$lib/utils/cookies"
import { API_BASE_URL } from "./config";

export async function login(email: string, password: string) {
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
        throw new Error("Email og password er påkrævet.");
    }

    const formData = new URLSearchParams();
    formData.append("Email", email);
    formData.append("Password", password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded" // Required for FormData
        },
        body: formData.toString() // Convert FormData to URL-encoded format
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login fejlede");
    }

    const data = await response.json();

    const { token } = data

    setCookie("jwt", token, { maxAge: 60 * 60, path: '/' })
    return
}

export async function signup(email: string, password: string, confirmPassword: string) {
    if (!email || !password || !confirmPassword || typeof email !== "string" || typeof password !== "string" || typeof confirmPassword !== "string") {
        throw new Error("Email og password er påkrævet.");
    }

    if (password != confirmPassword) {
        throw new Error("Passwords does not match!.");
    }

    const formData = new URLSearchParams();
    formData.append("Email", email);
    formData.append("Password", password);

    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded" // Required for FormData
        },
        body: formData.toString() // Convert FormData to URL-encoded format
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signup fejlede");
    }

    return
}

export async function logout() {
    deleteCookie("jwt")

    userStore.set(null)
    playlistsStore.set([])
    selectedPlaylistStore.set(null)
    selectedPlaylistSongsStore.set([])
    selectedPlaylistSongStore.set(null)
    currentSong.set(null)

    return;
}