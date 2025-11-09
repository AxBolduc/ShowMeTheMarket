import AuthStore from '$lib/stores/auth.svelte';
import { fetch } from '@tauri-apps/plugin-http';

// Your backend API endpoint for deep link authentication
const AUTH_API_ENDPOINT = 'https://account.theshow.com/xbl_sessions/app25_oauth.json';

export async function XblAuth(redirectCode: string): Promise<void> {
  // Prevent multiple simultaneous auth requests
  AuthStore.setIsLoading(true)

  try {
		// Make your authentication request to your backend
		const queryParams = new URLSearchParams({
			code: redirectCode,
			redirect_uri: 'com.mlb.xbl.app://redirect'
		});

        const url = `${AUTH_API_ENDPOINT}?${queryParams}`

        console.log(url)

		const response = await fetch(url, {
			method: 'GET',
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
			throw new Error(`Authentication failed: ${errorData.message || response.statusText}`);
		}

		const data = await response.json();
		const token = data.account_token; // Adjust based on your API response

		if (!token) {
			throw new Error('Authentication response did not contain an access token.');
		}

		AuthStore.setAuthToken(token); // Update the store with the new token
		console.log('Successfully authenticated via deep link!');
	} catch (error: any) {
    console.error('deepLinkAuth error:', error);
    AuthStore.setError(error.message || 'An unexpected error occurred' );
    throw error; // Re-throw to allow component to handle if necessary
  }
}