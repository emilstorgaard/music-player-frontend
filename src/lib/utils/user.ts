import { userStore } from "$lib/stores/auth";
import { getCookie } from "./cookies";
import { API_BASE_URL } from "$lib/utils/config";

export async function fetchUserData() {
    const jwt = getCookie('jwt')

    if (!jwt) {
      console.warn("JWT not found in cookies. User might not be logged in.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/users/authorized`, {
        method: "GET",
        headers: { 'Authorization': `Bearer ${jwt}` }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "FetchUserData fejlede");
    }

    const data = await response.json();

    userStore.set({ email: data.email, uid: data.id, jwt: jwt })
}