import z from 'zod';
import { FailureResponseSchema } from './utils';
import { InventoryItemSchema } from './inventory';

export const CollectionSchema = z.object({
	id: z.string(),
	name: z.string(),
	texture_name: z.string(),
	is_complete: z.string(), // NOTE: "0" or "1A"
	progress_current: z.string(), // NOTE: int string
	progress_max: z.string(), // NOTE: int string
	texture_url: z.string()
});

export const CollectionGroupSchema = z.object({
	id: z.string(),
	name: z.string(),
	texture_name: z.string(),
	texture_url: z.string()
});

// NOTE: Get Collections in Group
export const GetCollectionsInGroupSuccessResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	collections: z.array(CollectionSchema)
});

export const GetCollectionsInGroupResponseSchema = z.discriminatedUnion('success', [
	FailureResponseSchema,
	GetCollectionsInGroupSuccessResponseSchema
]);

export type GetCollectionsInGroupSuccessResponse = z.infer<
	typeof GetCollectionsInGroupSuccessResponseSchema
>;

export type GetCollectionsInGroupResponse = z.infer<typeof GetCollectionsInGroupResponseSchema>;

// NOTE: Get Collection Groups
export const GetCollectionGroupsSuccessResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	collection_groups: z.array(CollectionGroupSchema)
});

export const GetCollectionGroupsResponseSchema = z.discriminatedUnion('success', [
	FailureResponseSchema,
	GetCollectionGroupsSuccessResponseSchema
]);

export type GetCollectionGroupsSuccessResponse = z.infer<
	typeof GetCollectionGroupsSuccessResponseSchema
>;

export const GetcollectionGroupsResponseSchema = z.discriminatedUnion('success', [
	FailureResponseSchema,
	GetCollectionGroupsSuccessResponseSchema
]);

export type GetCollectionGroupsResponse = z.infer<typeof GetCollectionGroupsResponseSchema>;

// NOTE: Get Collection Detail

// Schema for collection items
export const CollectionItemSchema = z.object({
	id: z.string(),
	quantity: z.string(),
	min_quantity: z.string(),
	no_sell: z.string(),
	captained: z.string(),
	collection_index: z.string()
});

// Schema for collection reward
export const CollectionStatusSchema = z.object({
	progress_current: z.string(),
	progress_max: z.string()
});

// Schema for collection rewards items
export const CollectionRewardsItemSchema = z.object({
	has_collected: z.string(),
	all_matching: z.string(),
	qty_required: z.string(),
	item_id: z.string(),
	stubs: z.string(),
	xp: z.string()
});

// Schema for collection detail
export const CollectionDetailSchema = z.object({
	id: z.string(),
	message: z.string(),
	description: z.string(),
	items: z.array(CollectionItemSchema),
	reward: CollectionStatusSchema,
	rewards: z.array(CollectionRewardsItemSchema),
	page: z.string(),
	total_pages: z.string()
});

// Schema for successful get collection response
export const GetCollectionSuccessResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	collection: CollectionDetailSchema,
	inventory_items: z.array(InventoryItemSchema)
});

// Schema for get collection response
export const GetCollectionResponseSchema = z.discriminatedUnion('success', [
	FailureResponseSchema,
	GetCollectionSuccessResponseSchema
]);

export type GetCollectionSuccessResponse = z.infer<typeof GetCollectionSuccessResponseSchema>;

export type GetCollectionResponse = z.infer<typeof GetCollectionResponseSchema>;

export const CollectCardsSuccessResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	collection: z.object({
		id: z.string(),
		message: z.string(),
		collection: z.object({
			is_complete: z.union([z.literal('True'), z.literal('False')]),
			gained_item_ids: z.string()
		})
	})
});

export const CollectCardsResponseSchema = z.discriminatedUnion('success', [
	FailureResponseSchema,
	CollectCardsSuccessResponseSchema
]);

export type CollectCardsSuccessResponse = z.infer<typeof CollectCardsSuccessResponseSchema>;

export type CollectCardsResponse = z.infer<typeof CollectCardsResponseSchema>;
