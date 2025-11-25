<script lang="ts">
	import { getMyPacks } from '$lib/services/packs';
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import PackCard from '$lib/components/PackCard.svelte';
	import PackOpeningModal from '$lib/components/PackOpeningModal.svelte';
	import type { MyPackSchema } from '$lib/schemas/packs';
	import type { z } from 'zod';

	type Pack = z.infer<typeof MyPackSchema>;

	const authStore = getAuthStore();

	// State for the pack opening modal
	let isModalOpen = $state(false);
	let selectedPack = $state<Pack | null>(null);

	// Query to fetch user's packs
	const packsQuery = createQuery(() => ({
		queryKey: ['packs'],
		queryFn: () => {
			if (!authStore.accountId || !authStore.accountToken) {
				console.error('No auth in auth store');
				return null;
			}

			return getMyPacks({
				authInfo: {
					accountId: authStore.accountId.toString(),
					token: authStore.accountToken
				}
			});
		},
		enabled: !!authStore.accountId && !!authStore.accountToken
	}));

	// Function to handle pack click
	function handlePackClick(pack: Pack) {
		selectedPack = pack;
		isModalOpen = true;
	}

	// Function to close the modal
	function handleCloseModal() {
		isModalOpen = false;
		selectedPack = null;
	}
</script>

<div class="container mx-auto p-4">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-2xl font-bold">My Packs</h1>
	</div>

	{#if packsQuery.isLoading}
		<div class="flex justify-center my-12">
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:else if packsQuery.isError}
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
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span>Error loading packs. Please try again.</span>
			</div>
		</div>
	{:else if !packsQuery.data?.success}
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
				<span>No packs found.</span>
			</div>
		</div>
	{:else if packsQuery.data.data.length === 0}
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
				<span>You don't have any packs yet.</span>
			</div>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{#each packsQuery.data.data as pack}
				<PackCard {pack} onClick={() => handlePackClick(pack)} />
			{/each}
		</div>

		{#if selectedPack}
			<PackOpeningModal
				isOpen={isModalOpen}
				packId={selectedPack.id}
				packName={selectedPack.name}
				packImage={selectedPack.img}
				onClose={handleCloseModal}
			/>
		{/if}
	{/if}
</div>
