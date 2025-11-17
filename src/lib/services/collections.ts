import { GAME_API_BASE } from '$lib/constants';
import z, { ZodError } from 'zod';
import type { AuthInfo } from './types';
import { fetch } from '@tauri-apps/plugin-http';
import {
	CollectCardsResponseSchema,
	GetCollectionGroupsResponseSchema,
	GetCollectionResponseSchema,
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

export async function getCollection({
	authInfo,
	collectionId
}: {
	authInfo: AuthInfo;
	collectionId: string;
}) {
	const url = `${GAME_API_BASE}/collection_view.json`;

	const body = JSON.stringify({
		account_id: authInfo.accountId?.toString(),
		account_token: authInfo.token,
		collection_id: collectionId
	});

	const result = await fetch(url, {
		method: 'POST',
		body,
		headers: { 'content-type': 'application/json' }
	});

	if (!result.ok) {
		const errMsg = `Request to get collection with id ${collectionId} failed`;
		console.error(errMsg);
		throw new Error(errMsg);
	}

	try {
		const data = await result.json();

		console.log(data);

		const parsedData = GetCollectionResponseSchema.parse(data);

		return parsedData;
	} catch (err) {
		const errMsg = 'Validation failed for getCollection request';

		if (err instanceof ZodError) {
			console.error(z.prettifyError(err));
			throw new Error(errMsg);
		}

		throw new Error('unknown error');
	}
}

export async function collectCards({
	authInfo,
	collectionId,
	itemIds
}: {
	authInfo: AuthInfo;
	collectionId: string;
	itemIds: string[];
}) {
	const url = `${GAME_API_BASE}/collection_advance.json`;

	const body = JSON.stringify({
		account_id: authInfo.accountId?.toString(),
		account_token: authInfo.token,
		collection_id: collectionId,
		item_ids: itemIds.join(',')
	});

	const result = await fetch(url, {
		method: 'POST',
		body,
		headers: { 'content-type': 'application/json' }
	});

	if (!result.ok) {
		const errMsg = `Request to collect cards for collection id ${collectionId} failed`;
		console.error(errMsg);
		throw new Error(errMsg);
	}

	try {
		const data = await result.json();

		console.log(data);

		const parsedData = CollectCardsResponseSchema.parse(data);

		return parsedData;
	} catch (err) {
		const errMsg = 'Validation failed for collectCards request';

		if (err instanceof ZodError) {
			console.error(z.prettifyError(err));
			throw new Error(errMsg);
		}

		throw new Error('unknown error');
	}
}
