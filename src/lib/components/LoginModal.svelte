<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function close() {
        dispatch('close');
    }

	import { login } from "$lib/utils/auth";
	import { fetchUserData } from '$lib/utils/user';
	import Modal from './Modal.svelte';

	let email = "";
    let password = "";
    let errorMessage = "";

    async function handleLogin(event: SubmitEvent) {
        event.preventDefault();

        try {
            await login(email, password);
			await fetchUserData()

			close()
        } catch (error: any) {
            errorMessage = error.message;
        }
    }

</script>

<Modal title="Login" on:close={close}>
	<form on:submit={handleLogin}>
				
		<div class="space-y-4 md:space-y-6" >
			<div>
				<label for="email" class="block mb-2 text-sm font-medium">Email</label>
				<input
					type="email"
					name="email"
					bind:value={email}
					id="email"
					class="bg-gray-50 border border-gray-300 text-gray sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
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
					class="bg-gray-50 border border-gray-300 text-gray sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
					required
				/>
			</div>

			{#if errorMessage}
				<p style="color: red;">{errorMessage}</p>
			{/if}

			<button type="submit" class="w-full bg-green text-white hover:bg-light-green px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out">Log ind</button>
		</div>
	</form>
</Modal>