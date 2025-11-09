import { AUTH_API_ENDPOINT } from "$lib/constants";
import { TheShowAuthResponseSchema } from "$lib/schemas/auth";
import { fetch } from "@tauri-apps/plugin-http";

export async function AuthenticateWithXbox(authCode: string) {
	// Make your authentication request to your backend
	const queryParams = new URLSearchParams({
		code: authCode,
		redirect_uri: 'com.mlb.xbl.app://redirect'
	});

	const url = `${AUTH_API_ENDPOINT}?${queryParams}`;

	const response = await fetch(url, {
		method: 'GET'
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
		throw new Error(`Authentication failed: ${errorData.message || response.statusText}`);
	}

	const data = await response.json();

    const parsedResponse = TheShowAuthResponseSchema.parse(data);

	const token = parsedResponse.account_token; 
	if (!token) {
		throw new Error('Authentication response did not contain an access token.');
	}

    return parsedResponse
}
