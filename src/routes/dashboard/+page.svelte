<script lang='ts'>
    let {data} = $props();
	import Wallet from '$lib/components/wallet.svelte';
	import { authManager } from '$lib/stores/auth.svelte';
</script>

<div class="hero min-h-screen">
	<div class="hero-content text-center">
		<div class="flex flex-col gap-4">
			<h1 class="text-4xl">Welcome {authManager.username}</h1>
			<Wallet stubs={data.stubs} />
            <a href="/market/listings">
                <button class="btn btn-primary">View Listings</button>
            </a>
		</div>
	</div>
</div>
