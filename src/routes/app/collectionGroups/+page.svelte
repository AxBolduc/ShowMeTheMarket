<script lang="ts">
	import { getCollectionGroups } from '$lib/services/collections';
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { goto } from '$app/navigation';

	const authStore = getAuthStore();

	const collectionGroupsQuery = createQuery(() => ({
		queryKey: ['collectionGroups'],
		queryFn: () => {
			if (!authStore.accountId || !authStore.token) {
				console.error('No auth in auth store');
				return null;
			}

			return getCollectionGroups({
				authInfo: {
					accountId: authStore.accountId.toString(),
					token: authStore.token
				}
			});
		}
	}));
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold mb-6">Collections</h1>

	{#if collectionGroupsQuery.isLoading}
		<div class="flex justify-center my-12">
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:else if collectionGroupsQuery.isError}
		<div class="alert alert-error shadow-lg">
			<div class="flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 mr-2"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
				<span>Error loading collections. Please try again.</span>
			</div>
		</div>
	{:else if !collectionGroupsQuery.data?.success || !collectionGroupsQuery.data?.collection_groups?.length}
		<div class="alert alert-info shadow-lg">
			<div class="flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 mr-2"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span>No collections found.</span>
			</div>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each collectionGroupsQuery.data.collection_groups as group}
				<a
					class="card bg-base-300 shadow-white/5 shadow-lg hover:shadow-2xl transition-all cursor-pointer"
					href="/app/collectionGroups/{group.id}"
				>
					<figure class="px-4 pt-4 flex items-center justify-center">
						<img
							src={group.texture_url}
							alt={group.name}
							class="rounded-xl max-h-60 h-auto w-auto object-contain"
							loading="lazy"
						/>
					</figure>
					<div class="card-body items-center text-center p-4 bg-base-200">
						<h2 class="card-title text-lg font-medium">{group.name}</h2>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
