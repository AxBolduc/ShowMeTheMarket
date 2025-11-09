<script lang="ts">
	import { GlobalState, preventDefault } from '$lib';
	import { openUrl } from '@tauri-apps/plugin-opener';
	import AuthStore, { authStore } from '$lib/stores/auth.svelte';

	const gs = new GlobalState();

	$inspect(gs.greet, gs.name);

	async function openXboxLogin() {
		console.log('clicked');
		await openUrl(
			'https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=42341ce3-3c4b-426c-acfe-40dea2c0fdab&redirect_uri=com.mlb.xbl.app://redirect&response_type=code&scope=xboxlive.signin'
		);
	}
</script>

<div class="hero bg-blue-200 min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md flex flex-col gap-4">
			{#if authStore.token === null}
				<h1 class="text-5xl text-black">Login with Xbox</h1>
				<button
					class="bg-green-400 p-2 border-white border-solid border rounded-lg"
					onclick={openXboxLogin}
				>
					<span class="text-2xl text-black">login</span>
				</button>
			{:else}
				<h1 class="text-5xl text-black">Logged In with XBox</h1>
			{/if}
		</div>
	</div>
</div>
