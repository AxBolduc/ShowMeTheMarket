import z from 'zod';
import { FailureResponseSchema } from './utils';
import { ItemSchema } from './listings';

export const GetInventoryItemsSuccessResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	inventory_items: z.array(ItemSchema)
});

export const getInventoryItemsResponseSchema = z.discriminatedUnion('success', [
	FailureResponseSchema,
	GetInventoryItemsSuccessResponseSchema
]);

export type GetInventoryItemsSuccessResponse = z.infer<
	typeof GetInventoryItemsSuccessResponseSchema
>;

export type GetInventoryItemsResponse = z.infer<typeof getInventoryItemsResponseSchema>;
