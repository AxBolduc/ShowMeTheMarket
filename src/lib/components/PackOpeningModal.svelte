<script lang="ts">
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { openPack } from '$lib/services/packs';
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import { fly, fade, scale } from 'svelte/transition';
	import { getInventoryItems } from '$lib/services/inventory';
	import InventoryItemCard from './InventoryItemCard.svelte';
	import type { MlbCard } from '$lib/schemas/mlbCard';

	// Props
	const {
		isOpen = false,
		packId = '',
		packName = 'Pack',
		packImage = '',
		onClose = () => {}
	} = $props<{
		isOpen: boolean;
		packId: string;
		packName: string;
		packImage: string;
		onClose: () => void;
	}>();

	const authStore = getAuthStore();
	const queryClient = useQueryClient();

	// State management
	let currentStage = $state('initial'); // initial, opening, reveal, complete
	let currentCardIndex = $state(0);
	let cardItems = $state<any[]>([]);
	let revealedCards = $state<boolean[]>([]);

	// Reset state when modal opens
	$effect(() => {
		if (isOpen) {
			currentStage = 'initial';
			currentCardIndex = 0;
			cardItems = [];
			revealedCards = [];
		}
	});

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
		onSuccess: (data) => {
			cardItems = data;
			currentStage = 'reveal';

			// Invalidate packs query to refresh the pack list
			queryClient.invalidateQueries({ queryKey: ['packs'] });
		},
		onError: (error) => {
			console.error('Failed to open pack:', error);
			currentStage = 'initial';
		}
	}));

	// Function to start pack opening
	function startPackOpening() {
		currentStage = 'opening';
		openPackMutation.mutate();
	}

	// Function to reveal next card
	function revealNextCard() {
		if (currentCardIndex < cardItems.length) {
			revealedCards[currentCardIndex] = true;
			currentCardIndex++;
		}

		if (currentCardIndex >= cardItems.length) {
			setTimeout(() => {
				currentStage = 'complete';
			}, 1000);
		}
	}

	// Function to reveal all cards at once
	function revealAllCards() {
		revealedCards = Array(cardItems.length).fill(true);
		currentCardIndex = cardItems.length;
		setTimeout(() => {
			currentStage = 'complete';
		}, 1000);
	}

	// Function to close the modal
	function handleClose() {
		onClose();
	}

	// Determine if a card is high value (e.g., rare)
	function isHighValueCard(card: MlbCard) {
		return card.rarity === 'Diamond' || card.rarity === 'Gold' || card.ovr >= 90;
	}
</script>

<div class="modal {isOpen ? 'modal-open' : ''}" role="dialog">
	<div class="modal-box max-w-4xl bg-base-200 p-0 overflow-hidden">
		{#if currentStage === 'initial'}
			<!-- Initial Stage: Show pack and "Open" button -->
			<div class="flex flex-col items-center py-10" transition:fade>
				<h2 class="text-2xl font-bold mb-6">{packName}</h2>
				<div class="w-64 h-64 mb-8">
					<img src={packImage} alt={packName} class="w-full h-full object-contain" />
				</div>
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
		{:else if currentStage === 'opening'}
			<!-- Opening Animation -->
			<div class="flex justify-center items-center py-16">
				<div class="loading loading-spinner loading-lg"></div>
			</div>
		{:else if currentStage === 'reveal'}
			<!-- Card Reveal Stage -->
			<div class="p-6">
				<div class="flex justify-between items-center mb-8">
					<h2 class="text-2xl font-bold">Your New Cards!</h2>
					<button class="btn btn-outline" onclick={revealAllCards}> Reveal All </button>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
					{#each cardItems as card, i}
						<div
							class="transform transition-all duration-500 {revealedCards[i]
								? 'scale-100'
								: 'scale-90'} {i === currentCardIndex && !revealedCards[i]
								? 'pulse-animation'
								: ''}"
						>
							{#if revealedCards[i]}
								<!-- Revealed card -->
								<div in:fly={{ y: 20, duration: 500, delay: 100 }}>
									<InventoryItemCard
										item={card}
										itemId={card.id.toString()}
										isOwned={true}
										showDetails={true}
									/>
									{#if isHighValueCard(card)}
										<div
											in:scale={{ duration: 300, delay: 200 }}
											class="badge badge-accent mt-2 w-full"
										>
											Rare Find!
										</div>
									{/if}
								</div>
							{:else}
								<!-- Card back -->
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

				{#if currentCardIndex < cardItems.length}
					<div class="text-center">
						<p>Click on the next card to reveal or use "Reveal All" to see all at once</p>
					</div>
				{/if}
			</div>
		{:else if currentStage === 'complete'}
			<!-- Complete Stage: Summary of cards -->
			<div class="p-6" in:fade={{ duration: 300 }}>
				<h2 class="text-2xl font-bold mb-6">Pack Opening Complete!</h2>

				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
					{#each cardItems as card}
						<InventoryItemCard
							item={card}
							itemId={card.id.toString()}
							isOwned={true}
							showDetails={true}
						/>
					{/each}
				</div>

				<div class="flex justify-end mt-6">
					<button class="btn btn-primary" onclick={handleClose}> Done </button>
				</div>
			</div>
		{/if}
	</div>

	<form method="dialog" class="modal-backdrop">
		<button onclick={handleClose}>close</button>
	</form>
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
