<script lang="ts">
	import type { GetListingsResponse } from '$lib/schemas/listings';
	import { goto } from '$app/navigation';

	const { listing }: { listing: GetListingsResponse['listings'][number] } = $props();
	const numberFormatter = new Intl.NumberFormat();

	function navigateToDetail() {
		goto(`/app/market/listings/${listing.item.uuid}`);
	}

	function handleBuyClick(event: Event) {
		event.stopPropagation();
		// Handle buy logic here
	}

	function handleSellClick(event: Event) {
		event.stopPropagation();
		// Handle sell logic here
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			navigateToDetail();
		}
	}
</script>

<div
	class="list-row hover:bg-base-200 transition-colors cursor-pointer"
	onclick={navigateToDetail}
	onkeydown={handleKeyDown}
	role="button"
	tabindex="0"
>
	<div>
		<img
			class="size-32 rounded-box object-contain"
			src={listing.item.baked_img}
			alt={listing.listing_name}
		/>
	</div>
	<div>
		<div>{listing.listing_name}</div>
		<div class="text-xs uppercase font-semibold opacity-60">{listing.item.series}</div>
	</div>
	<div class="">
		<button class="btn btn-primary" onclick={handleBuyClick}>
			Buy: {numberFormatter.format(listing.best_sell_price)}
		</button>
		<button class="btn btn-secondary" onclick={handleSellClick}>
			Sell: {numberFormatter.format(listing.best_buy_price)}
		</button>
	</div>
</div>
