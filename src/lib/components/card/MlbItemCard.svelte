<script lang="ts">
	// Props definition
	let {
		item, // Full inventory item data (optional)
		isOwned = false, // Whether the user owns this item
		isLoading = false, // Whether this item is loading
		isCollected = false, // Whether this item is collected in a collection
		isSelected = false, // Whether this item is selected for collection
		showDetails = true, // Whether to show full details
		onClick = undefined // Click handler (optional)
	}: {
		item?: {
			rarity: string;
			ovr: number;
			name: string;
			img: string;
			baked_img: string;
			team: string;
		};
		isOwned: boolean;
		isLoading?: boolean;
		isCollected?: boolean;
		isSelected?: boolean;
		showDetails?: boolean;
		onClick?: () => void;
	} = $props();

	// Compute display values with proper fallbacks
	const name = $derived(item?.name);
	const imageUrl = $derived(item?.baked_img || item?.img || '');
	const hasImage = $derived(!!imageUrl);

	// Handle keyboard navigation
	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onClick?.();
		}
	}

	const borderClasses = $derived(
		isCollected ? 'border-success' : isSelected ? 'border-primary' : 'border-base-300'
	);
</script>

<div
	class="card bg-base-200 border {borderClasses} 
           shadow-lg {isLoading
		? 'animate-pulse'
		: ''} cursor-pointer hover:shadow-xl transition-shadow
           text-left w-full p-0"
	onclick={onClick ?? (() => console.log('Clicked'))}
	onkeydown={handleKeyDown}
	aria-label={`View details for ${name}`}
	role="button"
	tabindex="0"
>
	{#if hasImage && !isLoading}
		<figure class="px-3 pt-3">
			<img src={imageUrl} alt={name} class="rounded-lg w-full object-contain h-32" loading="lazy" />
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
			{/if}
		{/if}
	</div>
</div>
