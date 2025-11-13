<script lang="ts">
	import { getCollectionsInGroup } from '$lib/services/collections';
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { page } from '$app/state';

	const authStore = getAuthStore();
	const groupId = $state(page.params.groupId);

	// Query to fetch collections within the selected group
	const collectionsQuery = createQuery(() => ({
		queryKey: ['collections', groupId],
		queryFn: () => {
			if (!authStore.accountId || !authStore.token || !groupId) {
				console.error('No auth in auth store');
				return null;
			}

			return getCollectionsInGroup({
				groupId,
				authInfo: {
					accountId: authStore.accountId.toString(),
					token: authStore.token
				}
			});
		},
		enabled: !!groupId && !!authStore.accountId && !!authStore.token
	}));
</script>

<div class="p-4">
	<div class="flex items-center mb-6">
		<a href="/app/collectionGroups" class="btn btn-ghost btn-sm mr-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
			Back
		</a>
		<h1 class="text-2xl font-bold">Collection Details</h1>
	</div>

	{#if collectionsQuery.isLoading}
		<div class="flex justify-center my-12">
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:else if collectionsQuery.isError}
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
				<span>Error loading collection details. Please try again.</span>
			</div>
		</div>
	{:else if !collectionsQuery.data?.success || !collectionsQuery.data?.collections?.length}
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
				<span>No collections found in this group.</span>
			</div>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each collectionsQuery.data.collections as collection}
				<div class="card bg-base-300 shadow-lg shadow-white/5">
					<figure class="px-4 pt-4 flex items-center justify-center h-60">
						<img
							src={collection.texture_url}
							alt={collection.name}
							class="rounded-xl max-h-full w-auto object-contain"
							loading="lazy"
						/>
					</figure>
					<div class="card-body p-4 bg-base-200">
						<h2 class="card-title text-lg">{collection.name}</h2>
						<div class="flex justify-between items-center mt-2">
							<div class="flex items-center">
								<span class="text-sm mr-2 font-medium">Progress:</span>
								<progress
									class="progress progress-primary w-24"
									value={Number(collection.progress_current)}
									max={Number(collection.progress_max)}
								></progress>
							</div>
							<span class="text-sm font-medium"
								>{collection.progress_current}/{collection.progress_max}</span
							>
						</div>
						{#if collection.is_complete === '1'}
							<div class="badge badge-success mt-2">Complete</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
