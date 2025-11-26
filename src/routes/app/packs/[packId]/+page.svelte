<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { getMyPacks, openPack } from '$lib/services/packs';
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { fly, fade, scale } from 'svelte/transition';
	import { getInventoryItems } from '$lib/services/inventory';
	import EquipmentItemCard from '$lib/components/card/EquipmentItemCard.svelte';
	import MlbItemCard from '$lib/components/card/MlbItemCard.svelte';
	import type { Item } from '$lib/schemas/listings';

	const packId = $derived(page.params.packId || '');
	const authStore = getAuthStore();
	const queryClient = useQueryClient();

	// State management
	let currentStage = $derived.by(() => {
		if (packQuery.isPending) return 'loading';

		if (packQuery.isSuccess && openPackMutation.isIdle) return 'initial';

		if (packQuery.isSuccess && openPackMutation.isPending) return 'opening';

		if (currentCardIndex >= cardItems.length) {
			return 'complete';
		}

		if (packQuery.isSuccess && openPackMutation.isSuccess) return 'reveal';

		return 'initial';
	}); // loading, initial, opening, reveal, complete

	let currentCardIndex = $state(0);
	let revealedCards = $state<boolean[]>([]);

	// Query to get pack info
	const packQuery = createQuery(() => ({
		queryKey: ['pack', packId],
		queryFn: async () => {
			if (!authStore.accountId || !authStore.accountToken) {
				throw new Error('No auth in auth store');
			}

			const packsResult = await getMyPacks({
				authInfo: {
					accountId: authStore.accountId.toString(),
					token: authStore.accountToken
				}
			});

			if (packsResult.success) {
				const pack = packsResult.data.find((p) => p.id === packId);
				if (pack) {
					return {
						name: pack.name,
						img: pack.img
					};
				}
			}
			return null;
		},
		enabled: !!packId && !!authStore.accountId && !!authStore.accountToken
	}));

	// Pack opening mutation
	const openPackMutation = createMutation(() => ({
		mutationFn: async () => {
			if (!authStore.accountId || !authStore.accountToken) {
				throw new Error('Authentication required');
			}

			const packResult = await openPack({
				packId,
				authInfo: {
					accountId: authStore.accountId.toString(),
					token: authStore.accountToken
				}
			});

			if (packResult.success && packResult.data.length > 0) {
				// Get the full details of the items received
				const itemDetails = await getInventoryItems({
					itemIds: packResult.data.map((item) => item.id),
					authInfo: {
						accountId: authStore.accountId.toString(),
						token: authStore.accountToken
					}
				});

				if (itemDetails.success) {
					// Initialize revealed state for each card
					revealedCards = Array(itemDetails.inventory_items.length).fill(false);
					return itemDetails.inventory_items;
				}
			}

			return [];
		},
		onSuccess: () => {
			// Invalidate packs query to refresh the pack list
			queryClient.invalidateQueries({ queryKey: ['packs'] });
		},
		onError: (error) => {
			console.error('Failed to open pack:', error);
		}
	}));

	let cardItems = $derived(openPackMutation.data ?? []);

	// Function to start pack opening
	function startPackOpening() {
		openPackMutation.mutate();
	}

	// Function to reveal next card
	function revealNextCard() {
		if (currentCardIndex < cardItems.length) {
			revealedCards[currentCardIndex] = true;
			currentCardIndex++;
		}
	}

	// Function to reveal all cards at once
	function revealAllCards() {
		revealedCards = Array(cardItems.length).fill(true);
		currentCardIndex = cardItems.length;
	}

	// Function to go back to packs page
	function goBackToPacks() {
		goto('/app/packs');
	}

	// Determine if a card is high value (e.g., rare)
	function isHighValueCard(card: Item) {
		return card.rarity === 'Diamond' || card.rarity === '4';
	}
</script>

<div class="container mx-auto p-4 max-w-5xl">
	{#if currentStage === 'loading'}
		<!-- Loading state -->
		<div class="flex justify-center items-center min-h-[70vh]">
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:else if currentStage === 'initial'}
		<!-- Initial Stage: Show pack and "Open" button -->
		<div class="flex flex-col items-center py-10 min-h-[70vh]" transition:fade>
			<h1 class="text-3xl font-bold mb-6">Open {packQuery.data?.name || 'Pack'}</h1>
			<div class="w-72 h-72 mb-8">
				<img
					src={packQuery.data?.img}
					alt={packQuery.data?.name || 'Pack'}
					class="w-full h-full object-contain"
				/>
			</div>
			<div class="flex gap-4">
				<button class="btn btn-outline btn-lg" onclick={goBackToPacks}> Back to Packs </button>
				<button
					class="btn btn-primary btn-lg"
					onclick={startPackOpening}
					disabled={openPackMutation.isPending}
				>
					{#if openPackMutation.isPending}
						<span class="loading loading-spinner"></span>
						Opening...
					{:else}
						Open Pack
					{/if}
				</button>
			</div>
		</div>
	{:else if currentStage === 'opening'}
		<!-- Opening Animation -->
		<div class="flex flex-col justify-center items-center min-h-[70vh]">
			<h2 class="text-2xl font-bold mb-8">Opening Pack...</h2>
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:else if currentStage === 'reveal' || currentStage === 'complete'}
		<!-- Unified Card Reveal and Complete Stages -->
		<div class="min-h-[70vh]">
			<div class="mb-6 flex justify-between items-center">
				<div>
					<button class="btn btn-outline btn-sm gap-2" onclick={goBackToPacks}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
								clip-rule="evenodd"
							/>
						</svg>
						Back to Packs
					</button>
				</div>
				<h1 class="text-3xl font-bold">
					{currentStage === 'reveal' ? 'Your New Cards!' : 'Pack Opening Complete!'}
				</h1>
				<div class="min-w-28 text-right">
					{#if currentStage === 'reveal' && currentCardIndex < cardItems.length}
						<button class="btn btn-outline w-28" onclick={revealAllCards}> Reveal All </button>
					{/if}
				</div>
			</div>

			<!-- Same grid layout for both stages to avoid layout shift -->
			<div
				class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 min-h-[400px]"
			>
				{#each cardItems as card, i}
					<div
						class="transform transition-all duration-500 {revealedCards[i] ||
						currentStage === 'complete'
							? 'scale-100'
							: 'scale-90'} {i === currentCardIndex &&
						!revealedCards[i] &&
						currentStage === 'reveal'
							? 'pulse-animation'
							: ''}"
					>
						{#if revealedCards[i] || currentStage === 'complete'}
							<!-- Revealed card -->
							<div in:fly={{ y: 20, duration: 500, delay: 100 }}>
								{#if card.type === 'mlb_card'}
									<MlbItemCard item={card} isOwned={true} showDetails={true} />
								{:else}
									<EquipmentItemCard item={card} isOwned={true} />
								{/if}
								{#if isHighValueCard(card) && currentStage === 'reveal'}
									<div
										in:scale={{ duration: 300, delay: 200 }}
										class="badge badge-accent mt-2 w-full"
									>
										Rare Find!
									</div>
								{/if}
							</div>
						{:else}
							<!-- Card back (only shown in reveal stage for unrevealed cards) -->
							<div
								class="card bg-primary h-64 cursor-pointer flex items-center justify-center"
								onclick={revealNextCard}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										revealNextCard();
									}
								}}
								role="button"
								tabindex="0"
							>
								<div class="text-center text-primary-content">
									<svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
											clip-rule="evenodd"
										></path>
									</svg>
									<p class="mt-2">Click to Reveal</p>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>

			{#if currentStage === 'reveal' && currentCardIndex < cardItems.length}
				<div class="text-center h-10">
					<p>Click on the next card to reveal or use "Reveal All" to see all at once</p>
				</div>
			{:else if currentStage === 'complete'}
				<div class="flex justify-end mt-6">
					<button class="btn btn-primary btn-lg" onclick={goBackToPacks}>
						Return to My Packs
					</button>
				</div>
			{:else}
				<!-- Empty space to maintain consistent height -->
				<div class="h-10"></div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.pulse-animation {
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0% {
			transform: scale(0.95);
			box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
		}

		70% {
			transform: scale(1);
			box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
		}

		100% {
			transform: scale(0.95);
			box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
		}
	}
</style>
