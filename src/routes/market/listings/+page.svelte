<script lang="ts">
	import { getListings } from '$lib/services/listings';
	import _ from 'lodash';

	let { data } = $props();
	let listings = $state(data.listings);

	let searchQuery = $state<string | null>(null);

	const numberFormatter = new Intl.NumberFormat();

	const debouncedInput = _.debounce((value: string) => {
		searchQuery = value;
	}, 200);

	$effect(() => {
		console.log('Effect', searchQuery);

		if (searchQuery) {
			getListings({
				name: searchQuery ?? undefined
			}).then((result) => {
				listings = result.listings;
			});
		}
	});
</script>

<div class="m-8">
	<input type="search" placeholder="Search" class="w-full input rounded-lg bg-base-200 py-6" onkeyup={({currentTarget}) => {
        if(currentTarget?.value) {
            debouncedInput(currentTarget.value)
        }
    }}/>
	<ul class="list bg-base-100 rounded-box">
		{#each listings as listing}
			<li class="list-row hover:bg-base-200 transition-colors">
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
				<div class="">
					<button class="btn btn-primary"
						>Buy: {numberFormatter.format(listing.best_sell_price)}</button
					>
					<button class="btn btn-secondary"
						>Sell: {numberFormatter.format(listing.best_buy_price)}</button
					>
				</div>
			</li>
		{/each}
	</ul>
</div>
