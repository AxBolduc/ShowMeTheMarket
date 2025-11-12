<script lang="ts">
	import { goto } from '$app/navigation';
	import { getAuthStore } from '$lib/stores/auth.svelte';

	const authStore = getAuthStore();

	const { children } = $props();

	$effect(() => {
        console.log(authStore)
	});
</script>

{#if authStore.isLoading}
	<p>Loading...</p>
{:else if authStore.isAuthenticated}
	<div class="flex h-screen w-full flex-col">
		<main class="h-full w-full overflow-auto">
			{@render children()}
		</main>
	</div>
{:else}
	<p>You are not authenticated</p>
{/if}
