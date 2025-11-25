import { z } from 'zod';

export const GetListingsOptionsSchema = z.object({
	type: z.literal('mlb_card'), // type must strictly be "mlb_card"
	page: z.number().int().min(1, 'Page number must be at least 1'), // Page is a positive integer
	sort: z.enum(['rank', 'best_sell_price', 'best_buy_price']), // Enforce specific sort options
	rarity: z.enum(['diamond', 'gold', 'silver', 'bronze', 'common']), // Enforce specific rarity options
	order: z.enum(['desc', 'asc']), // Enforce specific order options
	name: z.string().trim().min(1, 'Name cannot be empty'), // Name is a non-empty string
	min_best_sell_price: z.number().min(0, 'Min sell price cannot be negative'), // Non-negative number
	max_best_sell_price: z.number().min(0, 'Max sell price cannot be negative'), // Non-negative number
	min_best_buy_price: z.number().min(0, 'Min buy price cannot be negative'), // Non-negative number
	max_best_buy_price: z.number().min(0, 'Max buy price cannot be negative'), // Non-negative number
	min_rank: z.number().int().min(0, 'Min rank cannot be negative'), // Non-negative integer
	max_rank: z.number().int().min(0, 'Max rank cannot be negative') // Non-negative integer
});

// Infer the TypeScript type from the Zod schema
export type GetListingsOptions = z.infer<typeof GetListingsOptionsSchema>;

// --- 1. Item Schema ---
// Represents the 'item' object within each listing
//
export const EquipmentItemSchema = z.object({
	type: z.literal('equipment'),
	uuid: z.string(),
	img: z.url('Invalid image URL format'),
	baked_img: z.url('Invalid baked image URL format'),
	name: z.string().min(1, 'Item name cannot be empty'),
	short_description: z.nullable(z.string()),
	rarity: z.string(),
	brand: z.string(),
	brand_logo_name: z.string(),
	slot: z.string(),
	attribute_names: z.array(z.string()),
	attribute_values: z.array(z.string()),
	description: z.string(),
	is_sellable: z.boolean().optional()
});

export const MlbCardItemSchema = z.object({
	uuid: z.string(),
	type: z.literal('mlb_card'), // As established, it's 'mlb_card'
	img: z.url('Invalid image URL format'), // Expecting a valid URL
	baked_img: z.url('Invalid baked image URL format'),
	sc_baked_img: z.url('Invalid SC baked image URL format').nullable(), // Can be null
	name: z.string().min(1, 'Item name cannot be empty'),
	short_description: z.string().nullable(), // Can be null
	rarity: z.enum(['Diamond', 'Gold', 'Silver', 'Bronze', 'Common']), // Case-sensitive based on JSON
	team: z.string().min(1, 'Team name cannot be empty'),
	team_short_name: z.string().min(1, 'Team short name cannot be empty'),
	ovr: z.number().int().min(0, 'OVR cannot be negative'), // Overall rating
	series: z.string().min(1, 'Series cannot be empty'),
	series_texture_name: z.string(), // Appears to be an empty string, but could be dynamic
	series_year: z.number().int().min(1900, 'Invalid series year'), // Reasonable min year
	display_position: z.string().min(1, 'Display position cannot be empty'),
	has_augment: z.boolean(),
	augment_text: z.string().nullable(),
	augment_end_date: z.iso.datetime({ message: 'Invalid augment end date format' }).nullable(), // Use .datetime for ISO strings
	has_matchup: z.boolean(),
	stars: z.number().nullable(), // Can be null
	trend: z.number().nullable(), // Can be null
	new_rank: z.number().int().min(0, 'New rank cannot be negative'),
	has_rank_change: z.boolean(),
	event: z.boolean(),
	set_name: z.string().min(1, 'Set name cannot be empty'),
	is_live_set: z.boolean(),
	ui_anim_index: z.number().int().min(0, 'UI animation index cannot be negative')
});

export const UnlockableItemSchema = z.object({
	uuid: z.string(),
	type: z.literal('unlockable'),
	img: z.url('Invalid image URL format'),
	baked_img: z.url('Invalid baked image URL format'),
	name: z.string().min(1, 'Item name cannot be empty'),
	short_description: z.nullable(z.string()),
	rarity: z.string(),
	is_sellable: z.boolean().optional()
});

export const SponsorshipItemSchema = z.object({
	baked_img: z.url('Invalid baked image URL format'),
	bonus: z.string(),
	brand: z.string(),
	brand_logo_name: z.string(),
	img: z.url('Invalid image URL format'),
	is_sellable: z.boolean().optional(),
	name: z.string().min(1, 'Item name cannot be empty'),
	rarity: z.string(),
	short_description: z.nullable(z.string()),
	uuid: z.string(),
	type: z.literal('sponsorship')
});

export const ItemSchema = z.discriminatedUnion('type', [
	EquipmentItemSchema,
	MlbCardItemSchema,
	UnlockableItemSchema,
	SponsorshipItemSchema
]);

export type Item = z.infer<typeof ItemSchema>;

// --- 2. Listing Schema ---
// Represents each 'listing' object in the 'listings' array
export const ListingSchema = z.object({
	listing_name: z.string().min(1, 'Listing name cannot be empty'),
	best_sell_price: z.number().int().min(0, 'Best sell price cannot be negative'),
	best_buy_price: z.number().int().min(0, 'Best buy price cannot be negative'),
	item: ItemSchema // Embed the ItemSchema here
});

export type Listing = z.infer<typeof ListingSchema>;

// --- 3. Full Response Schema ---
// Represents the entire JSON response
export const GetListingsResponseSchema = z.object({
	page: z.number().int().min(1, 'Page number must be at least 1'),
	per_page: z.number().int().min(1, 'Per page must be at least 1'),
	total_pages: z.number().int().min(0, 'Total pages cannot be negative'),
	listings: z.array(ListingSchema) // An array of ListingSchema
});

export type GetListingsResponse = z.infer<typeof GetListingsResponseSchema>;

// --- 4. Market Item Schema ---
// Represents individual items in items_to_sell and items_to_buy arrays
export const MarketItemSchema = z.object({
	price: z.string().regex(/^\d+$/, 'Price must be a numeric string'),
	display_price: z.string().min(1, 'Display price cannot be empty'),
	quantity: z.string().regex(/^\d+$/, 'Quantity must be a numeric string'),
	display_quantity: z.string().min(1, 'Display quantity cannot be empty')
});

export type MarketItem = z.infer<typeof MarketItemSchema>;

// --- 5. Listing Info Schema ---
// Represents the info object in the GetListing response
export const ListingInfoSchema = z.object({
	sales_tax: z.string().regex(/^\d+%$/, 'Sales tax must be a percentage string'),
	owned: z.string().regex(/^\d+$/, 'Owned quantity must be a numeric string'),
	sellable: z.string().regex(/^\d+$/, 'Sellable quantity must be a numeric string')
});

export type ListingInfo = z.infer<typeof ListingInfoSchema>;

// --- 6. Listing Data Schema ---
// Represents the data object in the GetListing response
export const ListingDataSchema = z.object({
	info: ListingInfoSchema,
	items_to_sell: z.array(MarketItemSchema),
	items_to_buy: z.array(MarketItemSchema)
});

export type ListingData = z.infer<typeof ListingDataSchema>;

// --- 7. Full GetListing Response Schema ---
// Represents the entire JSON response for a single listing
export const GetListingResponseSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	data: ListingDataSchema
});

export type GetListingResponse = z.infer<typeof GetListingResponseSchema>;
