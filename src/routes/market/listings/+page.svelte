<script lang="ts">
	import ListingsView from '$lib/components/listingsView.svelte';
	let { data } = $props();
</script>

<div>
	<div class="m-8">
		<ListingsView listings={data.listings} />
	</div>
</div>
