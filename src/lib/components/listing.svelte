<script lang="ts">
	import type { GetListingsResponse } from "$lib/schemas/listings";

    const {listing}: {listing: GetListingsResponse['listings'][number]} = $props()
    const numberFormatter = new Intl.NumberFormat();
</script>

<li class="list-row hover:bg-base-200 transition-colors">
	<div>
		<img class="size-32 rounded-box object-contain" src={listing.item.baked_img} alt={listing.listing_name} />
	</div>
	<div>
		<div>{listing.listing_name}</div>
		<div class="text-xs uppercase font-semibold opacity-60">{listing.item.series}</div>
	</div>
	<div class="">
		<button class="btn btn-primary">Buy: {numberFormatter.format(listing.best_sell_price)}</button>
		<button class="btn btn-secondary">Sell: {numberFormatter.format(listing.best_buy_price)}</button>
	</div>
</li>
