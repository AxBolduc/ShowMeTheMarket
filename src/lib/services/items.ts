import { PUBLIC_API_BASE } from '$lib/constants';
import { MlbCardSchema, PublicApiMlbCardSchema } from '$lib/schemas/mlbCard';
import { fetch } from '@tauri-apps/plugin-http';
import z, { ZodError } from 'zod';

export async function getItem({ itemUuid }: { itemUuid: string }) {
	const params = new URLSearchParams({ uuid: itemUuid });
	const url = `${PUBLIC_API_BASE}/item.json?${params}`;

	const result = await fetch(url, {
		method: 'GET',
		headers: { 'content-type': 'application/json' }
	});

	if (!result.ok) {
		const errMsg = `Request to get item with uuid ${itemUuid} failed`;
		console.error(errMsg);
		throw new Error(errMsg);
	}

	try {
		const data = await result.json();

		const parsedData = PublicApiMlbCardSchema.parse(data);

		return parsedData;
	} catch (err) {
		const errMsg = 'Validation failed for getItem request';

		if (err instanceof ZodError) {
			console.error(z.prettifyError(err));
			throw new Error(errMsg);
		}

		throw new Error('unknown error');
	}
}
