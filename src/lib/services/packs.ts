import { GAME_API_BASE } from '$lib/constants';
import { GetMyPacksResponseSchema, OpenPackResponseSchema } from '$lib/schemas/packs';
import z, { ZodError } from 'zod';
import type { AuthInfo } from './types';
import { fetch } from '@tauri-apps/plugin-http';

export async function getMyPacks({ authInfo }: { authInfo: AuthInfo }) {
	const url = `${GAME_API_BASE}/view_my_packs.json`;

	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify({
			account_id: authInfo.accountId?.toString(),
			account_token: authInfo.token
		}),
		headers: { 'content-type': 'application/json' }
	});

	if (!response.ok) {
		const errMsg = `Failed to get packs for account with id ${authInfo.accountId}`;
		console.error(errMsg);
		throw new Error(errMsg);
	}

	try {
		const data = await response.json();
		const parsedData = GetMyPacksResponseSchema.parse(data);

		return parsedData;
	} catch (err) {
		if (err instanceof ZodError) {
			const errMsg = 'Validation failed for getListing';
			console.error(errMsg, z.prettifyError(err));
			throw err;
		}

		console.error(err);
		throw new Error('Unknown error in getListing');
	}
}

export async function openPack({ packId, authInfo }: { packId: string; authInfo: AuthInfo }) {
	const url = `${GAME_API_BASE}/open_pack.json`;

	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify({
			account_id: authInfo.accountId?.toString(),
			account_token: authInfo.token,
			id: packId
		}),
		headers: { 'content-type': 'application/json' }
	});

	if (!response.ok) {
		const errMsg = `Failed to open pack with id ${packId}`;
		console.error(errMsg);
		throw new Error(errMsg);
	}

	try {
		const data = await response.json();

		console.log(data);

		const parsedData = OpenPackResponseSchema.parse(data);

		return parsedData;
	} catch (err) {
		if (err instanceof ZodError) {
			const errMsg = 'Validation failed for openPack';
			console.error(errMsg, z.prettifyError(err));
			throw err;
		}

		console.error(err);
		throw new Error('Unknown error in openPack');
	}
}
