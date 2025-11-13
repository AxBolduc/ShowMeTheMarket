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

// Schema for player pitches
export const PitchSchema = z.object({
	name: z.string(),
	speed: z.number(),
	control: z.number(),
	movement: z.number()
});

// Schema for player quirks
export const QuirkSchema = z.object({
	name: z.string(),
	description: z.string(),
	img: z.string()
});

// Schema for inventory items (MLB cards)
export const InventoryItemSchema = z.object({
	uuid: z.string(),
	type: z.string(),
	img: z.string(),
	baked_img: z.string(),
	sc_baked_img: z.nullable(z.string()),
	name: z.string(),
	short_description: z.nullable(z.string()),
	rarity: z.string(),
	team: z.string(),
	team_short_name: z.string(),
	ovr: z.number(),
	series: z.string(),
	series_texture_name: z.string(),
	series_year: z.number(),
	display_position: z.string(),
	display_secondary_positions: z.string(),
	jersey_number: z.string(),
	age: z.number(),
	bat_hand: z.string(),
	throw_hand: z.string(),
	weight: z.string(),
	height: z.string(),
	born: z.string(),
	is_hitter: z.boolean(),
	stamina: z.number(),
	pitching_clutch: z.number(),
	hits_per_bf: z.number(),
	k_per_bf: z.number(),
	bb_per_bf: z.number(),
	hr_per_bf: z.number(),
	pitch_velocity: z.number(),
	pitch_control: z.number(),
	pitch_movement: z.number(),
	contact_left: z.number(),
	contact_right: z.number(),
	power_left: z.number(),
	power_right: z.number(),
	plate_vision: z.number(),
	plate_discipline: z.number(),
	batting_clutch: z.number(),
	bunting_ability: z.number(),
	drag_bunting_ability: z.number(),
	hitting_durability: z.number(),
	fielding_durability: z.number(),
	fielding_ability: z.number(),
	arm_strength: z.number(),
	arm_accuracy: z.number(),
	reaction_time: z.number(),
	blocking: z.number(),
	speed: z.number(),
	baserunning_ability: z.number(),
	baserunning_aggression: z.number(),
	hit_rank_image: z.string(),
	fielding_rank_image: z.string(),
	pitches: z.array(PitchSchema),
	quirks: z.array(QuirkSchema),
	is_sellable: z.boolean(),
	has_augment: z.boolean(),
	augment_text: z.nullable(z.string()),
	augment_end_date: z.nullable(z.string()),
	has_matchup: z.boolean(),
	stars: z.nullable(z.number()),
	trend: z.nullable(z.string()),
	new_rank: z.number(),
	has_rank_change: z.boolean(),
	event: z.boolean(),
	set_name: z.string(),
	is_live_set: z.boolean(),
	ui_anim_index: z.number(),
	locations: z.array(z.string()),
	id: z.number()
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
