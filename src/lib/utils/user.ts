import { userStore } from "$lib/stores/auth";

export async function fetchUserData() {
    const response = await fetch("/api/user", {
        method: "GET"
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "FetchUserData fejlede");
    }

    // Parse the JSON response body
    const data = await response.json();

    userStore.set({ email: data.user.email, uid: data.user.id, jwt: data.jwt })
}