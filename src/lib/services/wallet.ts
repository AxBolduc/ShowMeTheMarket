import { GAME_API_BASE } from '$lib/constants';
import { GetStubsResponseSchema } from '$lib/schemas/wallet';
import { authManager } from '$lib/stores/auth.svelte';
import { fetch } from '@tauri-apps/plugin-http';
import z, { ZodError } from 'zod';

export async function getStubs() {
	const url = `${GAME_API_BASE}/view_my_wallet.json`;

	const body = JSON.stringify({
		account_id: authManager.accountId?.toString(),
		account_token: authManager.token
	});

	console.log(url);
	console.log(body);

	const result = await fetch(url, {
		method: 'POST',
		body,
        headers: {
            "content-type": "application/json"
        }
	});

	if (!result.ok) {
		const errMsg = 'Request to get stubs failed';
		console.error(errMsg);
		throw new Error(errMsg);
	}

	try {
		const data = await result.json();

		console.log(data);

		const parsedData = GetStubsResponseSchema.parse(data);

		return parsedData;
	} catch (err) {
		const errMsg = 'Validation failed for getStubs request';

		if (err instanceof ZodError) {
			console.error(z.prettifyError(err));
			throw new Error(errMsg);
		}

		throw new Error('unknown error');
	}
}
