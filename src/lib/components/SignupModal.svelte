<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function close() {
        dispatch('close');
    }

	import { signup } from "$lib/utils/auth";
	import Modal from './Modal.svelte';
	import { triggerToast } from '$lib/stores/toastStore';

	let email = "";
    let password = "";
	let confirmPassword = "";

    async function handleSignup(event: SubmitEvent) {
        event.preventDefault();

        try {
            await signup(email, password, confirmPassword);
			close()
        } catch (error: any) {
            triggerToast(error.message, 'error');
        }
    }

</script>

<Modal title="Signup" on:close={close}>
	<form on:submit={handleSignup}>
		<div class="space-y-4 md:space-y-6" >
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
					bind:value={password}
					name="password"
					id="password"
					placeholder="••••••••"
					class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
					required
				/>
			</div>
			<div>
				<label for="repeat-password" class="block mb-2 text-sm font-medium">Repeat Password</label>
				<input
					type="password"
					name="confirmPassword"
					bind:value={confirmPassword}
					id="confirmPassword"
					placeholder="••••••••"
					class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
					required
				/>
			</div>

			<button type="submit" class="w-full bg-green text-white hover:bg-light-green px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out">Signup</button>
		</div>
	</form>
</Modal>