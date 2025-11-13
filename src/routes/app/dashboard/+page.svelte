<script lang="ts">
	import Wallet from '$lib/components/wallet.svelte';
	import { getAuthStore } from '$lib/stores/auth.svelte';

	const authStore = getAuthStore();
</script>

<div class="hero min-h-screen">
	<div class="hero-content text-center">
		<div class="flex flex-col gap-4">
			<h1 class="text-4xl">Welcome {authStore.username}</h1>
			<Wallet />
			<a href="/app/market/listings">
				<button class="btn btn-primary">View Listings</button>
			</a>
		</div>
	</div>
</div>
