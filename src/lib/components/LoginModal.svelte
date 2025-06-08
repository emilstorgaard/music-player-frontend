<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { triggerToast } from '$lib/stores/toastStore';
	import { login } from "$lib/utils/auth";
    import { fetchUserData } from '$lib/utils/user';
    import Modal from './Modal.svelte';

    const dispatch = createEventDispatcher();
	let email = "";
    let password = "";

    function close() {
        dispatch('close');
    }

    async function handleLogin(event: SubmitEvent) {
        event.preventDefault();

        try {
            await login(email, password);
            await fetchUserData();
            close();
        } catch (error: any) {
            triggerToast(error.message, 'error');
        }
    }
</script>

<Modal title="Login" on:close={close}>
    <form on:submit={handleLogin}>
        <div class="space-y-4 md:space-y-6">
            <div>
                <label for="email" class="block mb-2 text-sm font-medium">Email</label>
                <input
                    type="email"
                    name="email"
                    bind:value={email}
                    id="email"
                    class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
                    placeholder="jens@jensen.com"
                    required
                />
            </div>
            <div>
                <label for="password" class="block mb-2 text-sm font-medium">Password</label>
                <input
                    type="password"
                    name="password"
                    bind:value={password}
                    id="password"
                    placeholder="••••••••"
                    class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
                    required
                />
            </div>

            <button type="submit" title="Login" class="w-full bg-green text-white hover:bg-light-green px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out">Log ind</button>
        </div>
    </form>
</Modal>