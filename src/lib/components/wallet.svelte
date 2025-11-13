<script>
	import { goto } from '$app/navigation';
	import { getStubs } from '$lib/services/wallet';
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import { createQuery } from '@tanstack/svelte-query';

	const authStore = getAuthStore();

	const numberFormatter = new Intl.NumberFormat();

	const stubsQuery = createQuery(() => ({
		queryKey: ['stubs'],
		queryFn: () => {
			if (!authStore.accountId || !authStore.token) {
				console.error('No auth in auth store');
				return null;
			}

			return getStubs({
				authInfo: {
					accountId: authStore.accountId.toString(),
					token: authStore.token
				}
			});
		}
	}));

	$effect(() => {
		if (!stubsQuery.isLoading && !stubsQuery.data?.success) {
			console.log('Not Authenticated');
			authStore.clearAuth();
			goto('/login');
		}
	});
</script>

<div class="bg-primary rounded-lg p-4">
	{#if stubsQuery.isLoading}
		<span>loading...</span>
	{:else}
		<span class="text-lg text-primary-content"
			>{stubsQuery.data?.success ? numberFormatter.format(stubsQuery.data.data) : 'NA'}</span
		>
	{/if}
</div>
