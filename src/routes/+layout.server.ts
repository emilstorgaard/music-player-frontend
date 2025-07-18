import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
    return {
        loggedInUser: locals.user ?? null,
    };
};