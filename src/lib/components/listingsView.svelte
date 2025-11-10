<script lang="ts">
	import type { GetListingsResponse } from '$lib/schemas/listings';
	import { getListings } from '$lib/services/listings';
	import _ from 'lodash';
	import Listing from './listing.svelte';

	const { listings }: { listings: GetListingsResponse['listings'] } = $props();

	let currentListings = $state(listings);

	let searchQuery = $state<string | null>(null);
	const debouncedInput = _.debounce((value: string) => {
		searchQuery = value;
	}, 200);

	$effect(() => {
		if (searchQuery) {
			getListings({
				name: searchQuery ?? undefined
			}).then((result) => {
				currentListings = result.listings;
			});
		}
	});
</script>

<input
	type="search"
	placeholder="Search"
	class="w-full input rounded-lg bg-base-200 py-6"
	onkeyup={({ currentTarget }) => {
		if (currentTarget?.value) {
			debouncedInput(currentTarget.value);
		}
	}}
/>
<ul class="list bg-base-100 rounded-box">
	{#each currentListings as listing}
		<Listing listing={listing} />
	{/each}
</ul>
