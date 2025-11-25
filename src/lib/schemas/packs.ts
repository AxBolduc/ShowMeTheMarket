import z from 'zod';
import { FailureResponseSchema } from './utils';

export const MyPackSchema = z.object({
	id: z.string(),
	name: z.string(),
	qty: z.string(),
	type_id: z.string(),
	img: z.url()
});

export const GetMyPacksSuccessResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	item_draft_pack_id: z.string(),
	data: z.array(MyPackSchema)
});

export const GetMyPacksResponseSchema = z.discriminatedUnion('success', [
	FailureResponseSchema,
	GetMyPacksSuccessResponseSchema
]);

export type GetMyPacksResponse = z.infer<typeof GetMyPacksResponseSchema>;
