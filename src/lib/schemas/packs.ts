import z from 'zod';
import { FailureResponseSchema } from './utils';
import { MlbCardSchema } from './mlbCard';
import {
	EquipmentItemSchema,
	ListingSchema,
	SponsorshipItemSchema,
	UnlockableItemSchema
} from './listings';

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

export const OpenPackCardSchema = z.object({
	id: z.string(),
	quantity: z.string(),
	type_id: z.string(),
	quick_sell_value: z.string()
});

export const OpenPackMlbCardItemSchema = ListingSchema.extend({
	item_template_id: z.number(),
	type: z.literal('mlb_card'),
	is_sellable: z.boolean(),
	qty: z.string().nullable(),
	item: MlbCardSchema.omit({ id: true })
});

export const OpenPackEquipmentItemSchema = ListingSchema.extend({
	item_template_id: z.number(),
	type: z.literal('equipment'),
	is_sellable: z.boolean(),
	qty: z.string().nullable(),
	item: EquipmentItemSchema
});

export const OpenPackSponsorshipItemSchema = ListingSchema.extend({
	item_template_id: z.number(),
	type: z.literal('sponsorship'),
	is_sellable: z.boolean(),
	qty: z.string().nullable(),
	item: SponsorshipItemSchema
});

export const OpenPackUnlockableItemSchema = ListingSchema.extend({
	item_template_id: z.number(),
	type: z.literal('unlockable'),
	is_sellable: z.boolean(),
	qty: z.string().nullable(),
	item: UnlockableItemSchema
});

export const OpenPackItemSchema = z.discriminatedUnion('type', [
	OpenPackMlbCardItemSchema,
	OpenPackEquipmentItemSchema,
	OpenPackUnlockableItemSchema,
	OpenPackSponsorshipItemSchema
]);

export const OpenPackSuccessResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	data: z.array(OpenPackCardSchema),
	items: z.array(OpenPackItemSchema)
});

export const OpenPackResponseSchema = z.discriminatedUnion('success', [
	FailureResponseSchema,
	OpenPackSuccessResponseSchema
]);

export type OpenPackResponse = z.infer<typeof OpenPackResponseSchema>;
