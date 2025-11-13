import z from 'zod';
import { FailureResponseSchema } from './utils';

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
