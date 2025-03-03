<script>
	import { enhance } from "$app/forms";
	import Search from "./Search.svelte";

	export let title = 'title';

	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<header class="mb-10">
	<nav class="flex items-center justify-between p-4 space-x-6 text-light-gray shadow-md">
		<a href="/" class="flex items-center space-x-3">
			<img src="/favicon.ico" alt="logo" class="h-8 w-auto" />
			<span class="text-xl font-bold hidden sm:block">{title}</span>
		</a>

		<Search />

		<div class="relative inline-block text-left">
			<div>
				<button
					on:click={toggleMenu}
					type="button"
					class="inline-flex items-center p-2 text-light-gray rounded-lg hover:bg-gray focus:outline-none focus:ring-2 focus:ring-gray"
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
			</div>
			<div class="{isMenuOpen ? '' : 'hidden'} absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-dark-gray rounded-md bg-gray shadow-lg ring-1 ring-black/5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
				<div class="py-1" role="none">
					<button on:click={toggleMenu} class="block w-full text-left px-4 py-2 text-sm text-light-gray hover:text-white hover:bg-light-gray rounded transition duration-200">Admin</button>
			  	</div>
			  	<div class="py-1" role="none">
					<button on:click={toggleMenu} class="block w-full text-left px-4 py-2 text-sm text-light-gray hover:text-white hover:bg-light-gray transition duration-200">Signup</button>
					<button on:click={toggleMenu} class="block w-full text-left px-4 py-2 text-sm text-light-gray hover:text-white hover:bg-light-gray transition duration-200">Log in</button>
			  	</div>
			  	<div class="py-1" role="none">
					<button type="submit" on:click={toggleMenu} class="block w-full text-left px-4 py-2 text-sm text-light-gray hover:text-white hover:bg-red-600 rounded transition duration-200">Log out</button>
			  	</div>
			</div>
		</div>
		
	</nav>

	<div class="{isMenuOpen ? '' : 'hidden'} lg:hidden" role="dialog" aria-modal="true">
		<div class="fixed inset-0 z-10 bg-black bg-opacity-50" on:click={toggleMenu}></div>
		<div class="fixed inset-y-0 right-0 z-20 w-full max-w-xs overflow-y-auto bg-dark-gray shadow-lg px-6 py-6 sm:ring-1 sm:ring-light-gray">
			<div class="flex items-center justify-between">
				<a href="/" class="-m-1.5 p-1.5">
					<img class="h-8 w-auto" src="/favicon.ico" alt="" />
				</a>
				<button on:click={toggleMenu} type="button" class="-m-2.5 rounded-md p-2.5 text-light-gray">
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
				<div class="-my-6 divide-y divide-dark-gray">
					<div class="space-y-4 py-6">
						<a href="/" on:click={toggleMenu} class="block py-2 px-4 text-center text-sm text-white bg-gray rounded hover:bg-light-gray transition duration-200">
							Admin
						</a>
					</div>

					<div class="space-y-4 py-6">
						<a href="/" on:click={toggleMenu} class="block py-2 px-4 text-center text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-200">
							Signup
						</a>
						<a href="/" on:click={toggleMenu} class="block py-2 px-4 text-center text-sm text-white bg-green rounded hover:bg-light-green transition duration-200">
							Log in
						</a>
						<form action="/" method="POST" use:enhance>
							<button type="submit" class="w-full max-w-md block py-2 px-4 text-center text-sm text-white bg-red-600 rounded hover:bg-red-700 transition duration-200">
								Log out
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</header>