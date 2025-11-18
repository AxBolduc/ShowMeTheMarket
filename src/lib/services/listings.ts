import { PUBLIC_API_BASE } from '$lib/constants';
import { GetListingsResponseSchema, type GetListingsOptions } from '$lib/schemas/listings';
import z, { ZodError } from 'zod';
import _ from 'lodash';
import { fetch } from '@tauri-apps/plugin-http';

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

