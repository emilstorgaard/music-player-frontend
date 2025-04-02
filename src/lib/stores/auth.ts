import { writable } from 'svelte/store';

export const userStore = writable<{ email: string; uid: string; jwt: string } | null>(null);