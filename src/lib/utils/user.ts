import { userStore } from "$lib/stores/auth";
import { getCookie } from "./cookies";

export async function fetchUserData() {
    const jwt = getCookie('jwt')

    if (!jwt) {
      console.warn("JWT not found in cookies. User might not be logged in.");
      return;
    }

    const response = await fetch(`${"https://music.emilstorgaard.dk/api"}/users/authorized`, {
        method: "GET",
        headers: { 'Authorization': `Bearer ${jwt}` }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "FetchUserData fejlede");
    }

    // Parse the JSON response body
    const data = await response.json();

    userStore.set({ email: data.email, uid: data.id, jwt: jwt })
}