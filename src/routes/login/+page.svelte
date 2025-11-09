<script lang="ts">
	import { GlobalState, preventDefault } from '$lib';
	import { authManager } from '$lib/stores/auth.svelte';
	import { openUrl } from '@tauri-apps/plugin-opener';

	const gs = new GlobalState();

	$inspect(gs.greet, gs.name);

	async function openXboxLogin() {
		console.log('clicked');
		await openUrl(
			'https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=42341ce3-3c4b-426c-acfe-40dea2c0fdab&redirect_uri=com.mlb.xbl.app://redirect&response_type=code&scope=xboxlive.signin'
		);
	}
</script>

<div class="hero min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md flex flex-col gap-4">
				<h1 class="text-5xl">Login with Xbox</h1>
				<button
					class="btn-primary btn"
					onclick={openXboxLogin}
				>
				{#if authManager.isLoading}
					<span class="loading loading-spinner"></span>
				{:else}
					<span class="text-2xl">login</span>
				{/if}
				</button>
		</div>
	</div>
</div>
