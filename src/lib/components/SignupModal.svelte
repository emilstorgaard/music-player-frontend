<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function close() {
        dispatch('close');
    }

	import { signup } from "$lib/utils/auth";

	let email = "";
    let password = "";
	let confirmPassword = "";
    let errorMessage = "";

    async function handleSignup(event: SubmitEvent) {
        event.preventDefault();

        try {
            await signup(email, password, confirmPassword);
			close()
        } catch (error: any) {
            errorMessage = error.message;
        }
    }

</script>

<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-dark-gray text-white rounded-lg p-6 shadow-lg w-full max-w-md">

		<div class="flex justify-between items-center px-6 sm:px-8">
			<h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl">
				Signup
			</h1>
			<button 
				on:click={close} 
				class="bg-gray hover:bg-light-gray text-white font-semibold py-2 px-4 rounded"
			>
				x
			</button>
		</div>

		<form on:submit={handleSignup} class="p-6 space-y-4 md:space-y-6 sm:p-8">
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
						bind:value={password}
						name="password"
						id="password"
						placeholder="••••••••"
						class="bg-gray-50 border border-gray-300 text-gray sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
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
						class="bg-gray-50 border border-gray-300 text-gray sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
						required
					/>
				</div>

				{#if errorMessage}
					<p style="color: red;">{errorMessage}</p>
				{/if}

				<button type="submit" class="w-full bg-green text-white hover:bg-light-green px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out">Signup</button>
			</div>
		</form>

    </div>
</div>