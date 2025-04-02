import { API_HOST } from "$env/static/private";
import type { ServerLoad } from '@sveltejs/kit'; // Import the correct type for `load`

export const load: ServerLoad = async ({ locals }) => {
    return {
        loggedInUser: locals.user ?? null,
        API_HOST
    };
};