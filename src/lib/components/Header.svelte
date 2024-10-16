<script>
	import { enhance } from "$app/forms"

	export let title = 'title';

	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<header class="mb-10">
	<nav class="flex justify-between items-center py-2 px-6 bg-white text-gray-800 shadow-md">
		<a href="/" class="flex items-center space-x-3">
			<img src="/favicon.png" alt="logo" class="h-8 w-auto" />
			<span class="text-lg font-semibold">{title}</span>
		</a>

		<div class="hidden lg:flex items-center space-x-6">
			<a href="/" class="py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition duration-200">About</a>
			<a href="/" class="py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition duration-200">Profile</a>
			<a href="/" class="py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition duration-200">Admin</a>
			<a href="/" class="py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition duration-200">Signup</a>
			<a href="/" class="py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition duration-200">Log in</a>
			<form action="/" method="POST" use:enhance>
				<button type="submit" class="py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition duration-200">Log ud</button>
			</form>
		</div>
		<button
			on:click={toggleMenu}
			data-collapse-toggle="mobile-menu-2"
			type="button"
			class="inline-flex items-center p-2 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
			aria-controls="mobile-menu-2"
			aria-expanded={isMenuOpen}
		>
			<svg
				class="w-6 h-6"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
					clip-rule="evenodd"
				></path></svg
			>
		</button>
	</nav>

	<div class="{isMenuOpen ? '' : 'hidden'} lg:hidden" role="dialog" aria-modal="true">
		<div class="fixed inset-0 z-10 bg-black bg-opacity-50" on:click={toggleMenu}></div>
		<div class="fixed inset-y-0 right-0 z-20 w-full max-w-xs overflow-y-auto bg-white shadow-lg px-6 py-6 sm:ring-1 sm:ring-gray-900/10">
			<div class="flex items-center justify-between">
				<a href="/" class="-m-1.5 p-1.5">
					<img class="h-8 w-auto" src="/favicon.png" alt="" />
				</a>
				<button on:click={toggleMenu} type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700">
					<svg
						class="w-6 h-6"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						>
						</path></svg
					>
				</button>
			</div>
			<div class="mt-6 flow-root">
				<div class="-my-6 divide-y divide-gray-500/10">
					<div class="space-y-4 py-6">
							<a href="/" on:click={toggleMenu} class="block py-2 px-4 text-center text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition duration-200">
								About
							</a>
	
							<a href="/" on:click={toggleMenu} class="block py-2 px-4 text-center text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition duration-200">
								Profile
							</a>

							<a href="/" on:click={toggleMenu} class="block py-2 px-4 text-center text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition duration-200">
								Admin
							</a>
					</div>

					<div class="space-y-4 py-6">
						<a href="/" on:click={toggleMenu} class="block py-2 px-4 text-center text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-200">
							Signup
						</a>
						<a href="/" on:click={toggleMenu} class="block py-2 px-4 text-center text-sm text-white bg-green-500 rounded hover:bg-green-600 transition duration-200">
							Log in
						</a>
						<form action="/" method="POST" use:enhance>
							<button type="submit" class="w-full max-w-md block py-2 px-4 text-center text-sm text-white bg-red-500 rounded hover:bg-red-600 transition duration-200">
								Log ud
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</header>