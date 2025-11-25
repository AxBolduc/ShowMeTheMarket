import { GAME_API_BASE, PUBLIC_API_BASE } from '$lib/constants';
import {
	GetListingResponseSchema,
	GetListingsResponseSchema,
	type GetListingsOptions
} from '$lib/schemas/listings';
import z, { ZodError } from 'zod';
import _ from 'lodash';
import { fetch } from '@tauri-apps/plugin-http';
import type { AuthInfo } from './types';

export async function getListings(opts?: Partial<GetListingsOptions>) {
	const stringifiedOptions = _.mapValues(opts, (opt) => opt?.toString());
	const queryParams = new URLSearchParams(stringifiedOptions);

	const url = `${PUBLIC_API_BASE}/listings.json${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

	const response = await fetch(url, {
		method: 'GET'
	});

	if (!response.ok) {
		const errMsg = 'Failed to get listings';
		console.error(errMsg);
		throw new Error(errMsg);
	}

	try {
		const data = await response.json();
		const parsedData = GetListingsResponseSchema.parse(data);

		return parsedData;
	} catch (err) {
		if (err instanceof ZodError) {
			const errMsg = 'Validation failed for getListings';
			console.error(errMsg, z.prettifyError(err));
			throw err;
		}

		console.error(err);
		throw new Error('Unknown error in getListings');
	}
}

export async function getListing({ itemUuid, authInfo }: { authInfo: AuthInfo; itemUuid: string }) {
	const url = `${GAME_API_BASE}/view_listing.json`;

	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify({
			account_id: authInfo.accountId?.toString(),
			account_token: authInfo.token,
			uuid: itemUuid
		}),
		headers: { 'content-type': 'application/json' }
	});

	if (!response.ok) {
		const errMsg = `Failed to get listing for item with uuid ${itemUuid}`;
		console.error(errMsg);
		throw new Error(errMsg);
	}

	try {
		const data = await response.json();
		const parsedData = GetListingResponseSchema.parse(data);

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
