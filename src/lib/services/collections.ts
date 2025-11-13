import { GAME_API_BASE } from '$lib/constants';
import z, { ZodError } from 'zod';
import type { AuthInfo } from './types';
import { fetch } from '@tauri-apps/plugin-http';
import {
	GetCollectionGroupsResponseSchema,
	GetCollectionsInGroupResponseSchema
} from '$lib/schemas/collections';

export async function getCollectionGroups({ authInfo }: { authInfo: AuthInfo }) {
	const url = `${GAME_API_BASE}/collection_view_groups.json`;

	const body = JSON.stringify({
		account_id: authInfo.accountId?.toString(),
		account_token: authInfo.token
	});

	const result = await fetch(url, {
		method: 'POST',
		body,
		headers: { 'content-type': 'application/json' }
	});

	if (!result.ok) {
		const errMsg = 'Request to get collection groups failed';
		console.error(errMsg);
		throw new Error(errMsg);
	}

	try {
		const data = await result.json();

		console.log(data);

		const parsedData = GetCollectionGroupsResponseSchema.parse(data);

		return parsedData;
	} catch (err) {
		const errMsg = 'Validation failed for getCollectionGroups request';

		if (err instanceof ZodError) {
			console.error(z.prettifyError(err));
			throw new Error(errMsg);
		}

		throw new Error('unknown error');
	}
}

export async function getCollectionsInGroup({
	groupId,
	authInfo
}: {
	groupId: string;
	authInfo: AuthInfo;
}) {
	const url = `${GAME_API_BASE}/collection_view_collections.json`;

	const body = JSON.stringify({
		account_id: authInfo.accountId?.toString(),
		account_token: authInfo.token,
		group_id: groupId
	});

	const result = await fetch(url, {
		method: 'POST',
		body,
		headers: { 'content-type': 'application/json' }
	});

	if (!result.ok) {
		const errMsg = `Request to get collections in group ${groupId} failed`;
		console.error(errMsg);
		throw new Error(errMsg);
	}

	try {
		const data = await result.json();

		console.log(data);

		const parsedData = GetCollectionsInGroupResponseSchema.parse(data);

		return parsedData;
	} catch (err) {
		const errMsg = 'Validation failed for getcollectionsInGroup request';

		if (err instanceof ZodError) {
			console.error(z.prettifyError(err));
			throw new Error(errMsg);
		}

		throw new Error('unknown error');
	}
}

