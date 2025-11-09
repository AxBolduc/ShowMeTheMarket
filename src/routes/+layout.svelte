<script lang="ts">
	import { listen } from '@tauri-apps/api/event';
	import '../app.css';
	import { onMount } from 'svelte';
	import { XblAuth } from '$lib/services/auth';
	let { children } = $props();

	onMount(() => {
		listenForDeepLinks()
	})

	async function listenForDeepLinks() {
		console.log('🔗 [Deep Link] Setting up event listener for deep-link events...');
		try {
			const unlisten = await listen<string>('deep-link', async (event) => {
				console.log('🔗🔗🔗 [Deep Link] EVENT RECEIVED!', event);
				let content = event.payload;

				const authCode = content.split("code=")[1]

				if(!authCode) {
					console.log("No Auth code found")
					return
				}

				try {
					await XblAuth(authCode);
				} catch (err) {
					if(err instanceof Error) {
						console.error(err.message)
					} else {
						console.error(err)
					}
				}
			});
			console.log('✅ [Deep Link] Event listener registered successfully!');
		} catch (error) {
			console.error('❌ [Deep Link] Failed to register event listener:', error);
		}
	}

</script>

{@render children()}
