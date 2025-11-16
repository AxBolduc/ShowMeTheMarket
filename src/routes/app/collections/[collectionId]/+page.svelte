<script lang="ts">
	import { getCollection } from '$lib/services/collections';
	import { getInventoryItems } from '$lib/services/inventory';
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { page } from '$app/state';
	import InventoryItemCard from '$lib/components/InventoryItemCard.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	const authStore = getAuthStore();
	const collectionId = $state(page.params.collectionId);

	// Query to fetch collection details
	const collectionQuery = createQuery(() => ({
		queryKey: ['collection', collectionId],
		queryFn: () => {
			if (!authStore.accountId || !authStore.token || !collectionId) {
				console.error('No auth in auth store or missing collection ID');
				return null;
			}

			return getCollection({
				collectionId,
				authInfo: {
					accountId: authStore.accountId.toString(),
					token: authStore.token
				}
			});
		},
		enabled: !!collectionId && !!authStore.accountId && !!authStore.token
	}));

	// Extract missing item IDs that need to be fetched
	const missingItemIds = $derived.by(() => {
		if (!collectionQuery.data?.success) return [];

		// Create a map of existing inventory items
		const existingItemIds = new Set(
			collectionQuery.data.inventory_items.map((item) => item.id.toString())
		);

		// Find item IDs in the collection that don't have inventory data
		return collectionQuery.data.collection.items
			.filter((item) => !existingItemIds.has(item.id))
			.map((item) => item.id);
	});

	// Query to fetch missing inventory items
	const inventoryItemsQuery = createQuery(() => ({
		queryKey: ['inventoryItems', missingItemIds],
		queryFn: () => {
			if (!authStore.accountId || !authStore.token || missingItemIds.length === 0) {
				return null;
			}

			return getInventoryItems({
				itemIds: missingItemIds,
				authInfo: {
					accountId: authStore.accountId.toString(),
					token: authStore.token
				}
			});
		},
		enabled:
			!!authStore.accountId &&
			!!authStore.token &&
			collectionQuery.isSuccess &&
			missingItemIds.length > 0
	}));

	// Combine inventory items from both API calls
	const inventoryItems = $derived.by(() => {
		if (!collectionQuery.data?.success) return undefined;

		// Start with items from the collection response
		const items = new Map(
			collectionQuery.data.inventory_items.map((item) => [item.id.toString(), item])
		);

		// Add items from the inventory items query if available
		if (inventoryItemsQuery.data?.success) {
			inventoryItemsQuery.data.inventory_items.forEach((item) => {
				items.set(item.id.toString(), item);
			});
		}

		return Object.fromEntries(items);
	});

	let selectedItems = $state(new SvelteSet<string>());

	// Function to get inventory item by ID
	function getInventoryItemById(id: string) {
		if (inventoryItems === undefined) return undefined;

		const item = inventoryItems[id];
		return item;
	}

	// Function to handle back navigation
	function goBack() {
		window.history.back();
	}

	// Function to handle selected cards action
	function handleSelectedCards() {
		// Get the selected inventory items
		const selectedItemsArray = [...selectedItems]
			.map((id) => getInventoryItemById(id))
			.filter(Boolean);

		// Log selected items for now (replace with your implementation)
		console.log('Processing selected items:', selectedItemsArray);

		// TODO: Implement the action you want to perform with selected cards
		// Examples:
		// - Open a modal with options
		// - Navigate to a new page with the selection
		// - Perform an API call
	}
</script>

<div class="p-4 relative">
	<div class="flex items-center mb-6">
		<button class="btn btn-ghost btn-sm mr-4" onclick={goBack}>
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
		</button>
		<h1 class="text-2xl font-bold">Collection Details</h1>
	</div>

	{#if collectionQuery.isLoading}
		<div class="flex justify-center my-12">
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:else if collectionQuery.isError}
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
				<span>Error loading collection. Please try again.</span>
			</div>
		</div>
	{:else if inventoryItemsQuery.isError}
		<div class="alert alert-warning shadow-lg">
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
				<span>Collection loaded but some item details could not be fetched.</span>
			</div>
		</div>
	{:else if !collectionQuery.data?.success}
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
				<span>Collection not found.</span>
			</div>
		</div>
	{:else}
		<!-- Collection Header -->
		<div class="bg-base-300 rounded-lg p-6 mb-6">
			<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
				<h2 class="text-xl font-bold mb-2 md:mb-0">{collectionQuery.data.collection.message}</h2>
				<div class="bg-primary/10 px-3 py-1 rounded-full">
					<span class="text-primary font-medium">
						{collectionQuery.data.collection.reward.progress_current}/{collectionQuery.data
							.collection.reward.progress_max} Items
					</span>
				</div>
			</div>
			<p class="text-base-content/80">{collectionQuery.data.collection.description}</p>

			<div class="mt-4">
				<div class="w-full bg-base-200 rounded-full h-4">
					<div
						class="bg-primary h-4 rounded-full"
						style="width: {(
							(Number(collectionQuery.data.collection.reward.progress_current) /
								Number(collectionQuery.data.collection.reward.progress_max)) *
							100
						).toFixed(0)}%"
					></div>
				</div>
			</div>
		</div>

		<!-- Collection Content -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Collection Items -->
			<div class="lg:col-span-2">
				<h3 class="text-lg font-bold mb-4">Collection Items</h3>

				{#if inventoryItemsQuery.isLoading && missingItemIds.length > 0}
					<div class="flex items-center gap-2 bg-info/20 p-3 rounded-lg mb-4">
						<div class="loading loading-spinner loading-sm"></div>
						<span>Loading additional item details...</span>
					</div>
				{/if}

				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{#each collectionQuery.data.collection.items as item}
						{@const inventoryItem = getInventoryItemById(item.id)}
						{@const isOwned = item.quantity !== '0'}
						{@const isCollected = item.collection_index !== '0'}
						{@const isLoading = inventoryItemsQuery.isLoading && missingItemIds.includes(item.id)}
						{@const isSelected = selectedItems.has(item.id)}

						<InventoryItemCard
							item={inventoryItem}
							itemId={item.id}
							{isOwned}
							{isCollected}
							{isLoading}
							{isSelected}
							showDetails={true}
							onClick={() => {
								if (!isOwned) return;

								selectedItems.has(item.id)
									? selectedItems.delete(item.id)
									: selectedItems.add(item.id);
							}}
						/>
					{/each}
				</div>
			</div>

			<!-- Collection Rewards -->
			<div>
				<h3 class="text-lg font-bold mb-4">Rewards</h3>

				<div class="bg-base-300 rounded-lg p-4">
					{#each collectionQuery.data.collection.rewards as reward}
						<div class="flex items-center p-3 border-b border-base-200 last:border-b-0">
							<div class="flex-1">
								{#if reward.item_id !== '0'}
									<div class="font-medium">Item Reward</div>
									<div class="text-sm opacity-70">Item ID: {reward.item_id}</div>
								{:else if reward.stubs !== '0'}
									<div class="font-medium">Stubs Reward</div>
									<div class="text-sm opacity-70">{reward.stubs} stubs</div>
								{:else if reward.xp !== '0'}
									<div class="font-medium">XP Reward</div>
									<div class="text-sm opacity-70">{reward.xp} XP</div>
								{/if}

								{#if reward.qty_required !== '0'}
									<div class="text-xs mt-1">Requires {reward.qty_required} items</div>
								{/if}
							</div>

							{#if reward.has_collected === '1'}
								<div class="badge badge-success">Collected</div>
							{:else}
								<div class="badge badge-outline">Uncollected</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

{#if selectedItems.size > 0}
	<div class="fixed bottom-6 right-6 transition-opacity duration-300 ease-in-out">
		<div class="tooltip tooltip-left" data-tip="Process selected cards">
			<button
				class="btn btn-primary btn-circle shadow-lg flex items-center justify-center gap-2"
				aria-label="Process selected cards"
				tabindex="0"
				onclick={handleSelectedCards}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						handleSelectedCards();
					}
				}}
			>
				<span class="badge badge-sm badge-accent absolute -top-2 -right-2"
					>{selectedItems.size}</span
				>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</button>
		</div>
	</div>
{/if}
