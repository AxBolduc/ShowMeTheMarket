<script lang="ts">
	import type { InventoryItemSchema } from '$lib/schemas/inventory';
	import type { z } from 'zod';

	type InventoryItem = z.infer<typeof InventoryItemSchema>;

	// Props definition
	let {
		item, // Full inventory item data (optional)
		itemId, // Item ID (required)
		isOwned = false, // Whether the user owns this item
		isLoading = false, // Whether this item is loading
		isCollected = false, // Whether this item is collected in a collection
		showDetails = true, // Whether to show full details
		onClick = undefined // Click handler (optional)
	} = $props<{
		item?: InventoryItem;
		itemId: string;
		isOwned: boolean;
		isLoading?: boolean;
		isCollected?: boolean;
		showDetails?: boolean;
		onClick?: () => void;
	}>();

	// Compute display values with proper fallbacks
	const name = $derived(item?.name || `Item #${itemId}`);
	const imageUrl = $derived(item?.baked_img || item?.img || '');
	const hasImage = $derived(!!imageUrl);

	// Handle keyboard navigation
	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onClick?.();
		}
	}
</script>

{#if onClick}
	<button
		type="button"
		class="card bg-base-200 border {isCollected ? 'border-success' : 'border-base-300'} 
           shadow-lg {isLoading
			? 'animate-pulse'
			: ''} cursor-pointer hover:shadow-xl transition-shadow
           text-left w-full p-0"
		onclick={onClick}
		onkeydown={handleKeyDown}
		aria-label={`View details for ${name}`}
	>
		{#if hasImage && !isLoading}
			<figure class="px-3 pt-3">
				<img
					src={imageUrl}
					alt={name}
					class="rounded-lg w-full object-contain h-32"
					loading="lazy"
				/>
			</figure>
		{/if}

		<div
			class="card-body p-3 {!hasImage || isLoading
				? 'flex items-center justify-center min-h-32'
				: ''}"
		>
			{#if isLoading}
				<div class="loading loading-spinner"></div>
				<p class="text-sm mt-2">Loading item...</p>
			{:else}
				<h4 class="card-title text-sm {!item ? 'opacity-50' : ''}">{name}</h4>

				{#if item && showDetails}
					<div class="flex items-center justify-between">
						<span class="badge badge-outline">{item.rarity}</span>
						<span class="badge badge-outline">{item.ovr} OVR</span>
					</div>
					<div class="mt-2 flex justify-between">
						<span class="text-xs opacity-70">{item.team}</span>
						{#if isOwned}
							<span class="badge badge-success badge-sm">Owned</span>
						{:else}
							<span class="badge badge-error badge-sm">Not Owned</span>
						{/if}
					</div>
				{:else if isOwned}
					<span class="badge badge-success badge-sm">Owned</span>
				{:else}
					<span class="badge badge-error badge-sm">Not Owned</span>
				{/if}
			{/if}
		</div>
	</button>
{:else}
	<div
		class="card bg-base-200 border {isCollected ? 'border-success' : 'border-base-300'} 
           shadow-lg {isLoading ? 'animate-pulse' : ''}"
	>
		{#if hasImage && !isLoading}
			<figure class="px-3 pt-3">
				<img
					src={imageUrl}
					alt={name}
					class="rounded-lg w-full object-contain h-32"
					loading="lazy"
				/>
			</figure>
		{/if}

		<div
			class="card-body p-3 {!hasImage || isLoading
				? 'flex items-center justify-center min-h-32'
				: ''}"
		>
			{#if isLoading}
				<div class="loading loading-spinner"></div>
				<p class="text-sm mt-2">Loading item...</p>
			{:else}
				<h4 class="card-title text-sm {!item ? 'opacity-50' : ''}">{name}</h4>

				{#if item && showDetails}
					<div class="flex items-center justify-between">
						<span class="badge badge-outline">{item.rarity}</span>
						<span class="badge badge-outline">{item.ovr} OVR</span>
					</div>
					<div class="mt-2 flex justify-between">
						<span class="text-xs opacity-70">{item.team}</span>
						{#if isOwned}
							<span class="badge badge-success badge-sm">Owned</span>
						{:else}
							<span class="badge badge-error badge-sm">Not Owned</span>
						{/if}
					</div>
				{:else if isOwned}
					<span class="badge badge-success badge-sm">Owned</span>
				{:else}
					<span class="badge badge-error badge-sm">Not Owned</span>
				{/if}
			{/if}
		</div>
	</div>
{/if}
