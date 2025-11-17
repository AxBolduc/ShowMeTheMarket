import { GAME_API_BASE } from '$lib/constants';
import { getInventoryItemsResponseSchema } from '$lib/schemas/inventory';
import z, { ZodError } from 'zod';
import type { AuthInfo } from './types';
import { fetch } from '@tauri-apps/plugin-http';

export async function getInventoryItems({
	authInfo,
	itemIds
}: {
	authInfo: AuthInfo;
	itemIds: string[];
}) {
	const url = `${GAME_API_BASE}/inventory_items.json`;

	const body = JSON.stringify({
		account_id: authInfo.accountId?.toString(),
		account_token: authInfo.token,
		item_ids: itemIds
	});

	const result = await fetch(url, {
		method: 'POST',
		body,
		headers: { 'content-type': 'application/json' }
	});

	if (!result.ok) {
		const errMsg = `Request to get inventory items with ids ${itemIds.join(',')} failed`;
		console.error(errMsg);
		throw new Error(errMsg);
	}

	try {
		const data = await result.json();

		console.log(data);

		const parsedData = getInventoryItemsResponseSchema.parse(data);

		return parsedData;
	} catch (err) {
		const errMsg = 'Validation failed for getInventoryItems request';

		if (err instanceof ZodError) {
			console.error(z.prettifyError(err));
			throw new Error(errMsg);
		}

		throw new Error('unknown error');
	}
}
