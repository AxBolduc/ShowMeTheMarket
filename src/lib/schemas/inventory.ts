import z from 'zod';
import { FailureResponseSchema } from './utils';

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

export const GetInventoryItemsSuccessResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	inventory_items: z.array(InventoryItemSchema)
});

export const getInventoryItemsResponseSchema = z.discriminatedUnion('success', [
	FailureResponseSchema,
	GetInventoryItemsSuccessResponseSchema
]);

export type GetInventoryItemsSuccessResponse = z.infer<
	typeof GetInventoryItemsSuccessResponseSchema
>;

export type GetInventoryItemsResponse = z.infer<typeof getInventoryItemsResponseSchema>;
