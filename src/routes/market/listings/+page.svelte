<script lang="ts">
	let { data } = $props();
	const numberFormatter = new Intl.NumberFormat();
</script>

<div class="m-8">
	<!-- <div class="grid grid-cols-3 gap-4">
		{#each data.listings as listing}
			<div class="card bg-base-300 shadow-sm">
				<figure class="bg-base-200">
					<img src={listing.item.baked_img} alt="card" />
				</figure>
				<div class="card-body">
					<h2 class="card-title">
						{listing.listing_name}
					</h2>
					<div class="card-actions justify-end">
						<button class="btn btn-primary">Buy Now {numberFormatter.format(listing.best_buy_price)}</button>
						<button class="btn btn-secondary">Sell Now {numberFormatter.format(listing.best_sell_price)}</button>
					</div>
				</div>
			</div>
		{/each}
	</div> -->

	<ul class="list bg-base-100 rounded-box shadow-md">
		{#each data.listings as listing}
			<li class="list-row">
				<div>
					<img
						class="size-10 rounded-box"
						src={listing.item.baked_img}
                        alt={listing.listing_name}
					/>
				</div>
				<div>
					<div>{listing.listing_name}</div>
					<div class="text-xs uppercase font-semibold opacity-60">{listing.item.series}</div>
				</div>
			</li>
		{/each}
	</ul>
</div>
