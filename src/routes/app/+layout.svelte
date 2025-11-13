<script lang="ts">
	// Import page from state instead of stores (which is deprecated in Svelte 5/SvelteKit 2.12+)
	import { page } from '$app/state';
	import Wallet from '$lib/components/wallet.svelte';

	const { children } = $props();

	// Function to determine if a route is active
	function isActive(route: string) {
		return page.url.pathname.startsWith(route);
	}

	// Function to close the drawer when a link is clicked
	function closeDrawer() {
		// Find drawer checkbox and uncheck it to close the drawer
		const drawerCheckbox = document.getElementById('app-drawer') as HTMLInputElement | null;
		if (drawerCheckbox) {
			drawerCheckbox.checked = false;
		}
	}

	// Define navigation items with their routes and icons
	const navItems = [
		{
			name: 'Home',
			route: '/app/dashboard',
			icon: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z'
		},
		{
			name: 'Market',
			route: '/app/market/listings',
			icon: 'M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2a1 1 0 000-2z'
		},
		{
			name: 'Collections',
			route: '/app/collectionGroups',
			icon: 'M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z'
		}
	];
</script>

<div class="drawer lg:drawer-open">
	<input id="app-drawer" type="checkbox" class="drawer-toggle" />

	<div class="drawer-content flex flex-col">
		<!-- Top navigation for mobile -->
		<div class="navbar bg-base-200 lg:hidden">
			<div class="navbar-start w-1/4">
				<label for="app-drawer" class="btn btn-square btn-ghost drawer-button">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block w-5 h-5 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>
					</svg>
				</label>
			</div>
			<div class="navbar-center w-2/4 flex justify-center">
				<a class="btn btn-ghost text-xl" href="/app/dashboard" onclick={closeDrawer}
					>Show Me The Market</a
				>
			</div>
			<div class="navbar-end w-1/4">
				<Wallet />
			</div>
		</div>

		<!-- Page content -->
		<div class="p-4">
			{@render children()}
		</div>
	</div>

	<div class="drawer-side">
		<label for="app-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

		<div
			class="menu p-4 w-64 h-screen bg-base-200 text-base-content gap-2 overflow-y-auto overscroll-none"
		>
			<!-- App logo/title -->
			<div class="flex items-center px-2">
				<span class="font-bold text-xl">Show Me The Market</span>
			</div>

			<div class="py-2">
				<Wallet />
			</div>

			<!-- Navigation links -->
			<ul>
				{#each navItems as item}
					<li>
						<a
							href={item.route}
							onclick={closeDrawer}
							class={isActive(item.route) ? 'active bg-base-300 font-medium' : ''}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path fill-rule="evenodd" d={item.icon} clip-rule="evenodd" />
							</svg>
							{item.name}

							<!-- Subtle indicator dot for active item -->
							{#if isActive(item.route)}
								<div class="ml-auto w-2 h-2 rounded-full bg-primary"></div>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
