<script lang="ts">
	import { page } from '$app/state';
	import { getItem } from '$lib/services/items';
	import { getListing } from '$lib/services/listings';
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import { createQuery } from '@tanstack/svelte-query';

	const itemId = $state(page.params.itemId);
	const authStore = getAuthStore();
	const numberFormatter = new Intl.NumberFormat();

	// Query to fetch item details
	const itemQuery = createQuery(() => ({
		queryKey: ['inventoryItem', itemId],
		queryFn: async () => {
			const response = await getItem({
				itemUuid: itemId!
			});

			return response;
		},
		enabled: !!itemId
	}));

	// Query to fetch market listing data
	const marketQuery = createQuery(() => ({
		queryKey: ['marketListing', itemId],
		queryFn: async () => {
			if (!authStore.accountId || !authStore.accountToken) {
				throw new Error('Authentication required');
			}

			const response = await getListing({
				itemUuid: itemId!,
				authInfo: {
					accountId: authStore.accountId.toString(),
					token: authStore.accountToken
				}
			});

			return response;
		},
		enabled: !!itemId && !!authStore.accountId && !!authStore.accountToken && itemQuery.isSuccess
	}));

	// Derived values for lowest sell price and highest buy price
	const lowestSellPrice = $derived.by(() => {
		if (!marketQuery.data?.success) return null;

		const itemsToSell = marketQuery.data.data.items_to_sell;
		if (itemsToSell.length === 0) return null;

		// Find the lowest price
		return parseInt(itemsToSell[0].price);
	});

	const highestBuyPrice = $derived.by(() => {
		if (!marketQuery.data?.success) return null;

		const itemsToBuy = marketQuery.data.data.items_to_buy;
		if (itemsToBuy.length === 0) return null;

		// Find the highest price
		return parseInt(itemsToBuy[0].price);
	});

	// Function to get the appropriate color class based on rarity
	function getRarityColorClass(rarity: string): string {
		switch (rarity.toLowerCase()) {
			case 'diamond':
				return 'text-blue-400';
			case 'gold':
				return 'text-yellow-400';
			case 'silver':
				return 'text-gray-400';
			case 'bronze':
				return 'text-amber-700';
			default:
				return 'text-gray-600';
		}
	}

	// Function to create stat bar
	function getStatBarWidth(value: number): string {
		return `${Math.min(value, 100)}%`;
	}
</script>

<div class="p-6">
	<!-- Breadcrumb Navigation -->
	<div class="text-sm breadcrumbs mb-4">
		<ul>
			<li><a href="/app/market/listings" class="text-primary">Listings</a></li>
			<li class="font-semibold">{itemQuery.data?.name ?? itemId}</li>
		</ul>
	</div>

	{#if itemQuery.isLoading}
		<div class="flex justify-center my-12">
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:else if itemQuery.isError}
		<div class="alert alert-error shadow-lg">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>Error loading item details. Please try again later.</span>
			<button
				class="btn btn-sm"
				onclick={() => {
					itemQuery.refetch();
				}}>Retry</button
			>
		</div>
	{:else if itemQuery.data}
		{@const item = itemQuery.data}

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Left Column: Card Image & Basic Info -->
			<div class="space-y-6">
				<div class="card bg-base-200 shadow-xl">
					<figure class="px-6 pt-6">
						<img src={item.baked_img} alt={item.name} class="rounded-xl object-contain max-h-96" />
					</figure>
					<div class="card-body">
						<h2 class="card-title text-2xl">{item.name}</h2>
						<div class="badge badge-lg {getRarityColorClass(item.rarity)}">{item.rarity}</div>
						<div class="flex flex-wrap gap-2 mt-2">
							<div class="badge badge-outline">{item.team}</div>
							<div class="badge badge-outline">{item.display_position}</div>
							<div class="badge badge-outline">{item.series}</div>
							<div class="badge badge-outline">OVR: {item.ovr}</div>
						</div>
						{#if item.short_description}
							<p class="mt-2 text-sm opacity-75">{item.short_description}</p>
						{/if}
					</div>
				</div>
				<!-- Market Status -->
				<div class="card bg-base-200 shadow-xl">
					<div class="card-body">
						<h3 class="card-title mb-2">Market Status</h3>
						<div class="flex flex-col gap-2">
							<button class="btn btn-primary btn-block">
								{#if marketQuery.isLoading}
									<div class="loading loading-spinner loading-xs mr-2"></div>
									 Buy Now
								{:else if lowestSellPrice !== null}
									Buy Now: {numberFormatter.format(lowestSellPrice)}
								{:else}
									Buy Now
								{/if}
							</button>
							<button class="btn btn-secondary btn-block">Place Buy Order</button>
							{#if item.is_sellable}
								<button class="btn btn-accent btn-block">
									{#if marketQuery.isLoading}
										<div class="loading loading-spinner loading-xs mr-2"></div>
										 Sell Card
									{:else if highestBuyPrice !== null}
										Sell Card: {numberFormatter.format(highestBuyPrice)}
									{:else}
										Sell Card
									{/if}
								</button>
							{:else}
								<button class="btn btn-disabled btn-block">Not Sellable</button>
							{/if}
						</div>
						{#if marketQuery.data?.success}
							<div class="mt-2 text-xs opacity-70">
								Sales Tax: {marketQuery.data.data.info.sales_tax}
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Middle Column: Player Stats -->
			<div class="card bg-base-200 shadow-xl">
				<div class="card-body">
					<h2 class="card-title mb-4">Player Attributes</h2>

					{#if item.is_hitter}
						<div class="mb-6">
							<h3 class="text-lg font-semibold mb-2">Hitting</h3>
							<div class="space-y-3">
								<div>
									<div class="flex justify-between mb-1">
										<span>Contact vs L</span>
										<span class="font-mono">{item.contact_left}</span>
									</div>
									<div class="w-full bg-base-300 rounded-full h-2">
										<div
											class="bg-primary h-2 rounded-full"
											style="width: {getStatBarWidth(item.contact_left)}"
										></div>
									</div>
								</div>
								<div>
									<div class="flex justify-between mb-1">
										<span>Contact vs R</span>
										<span class="font-mono">{item.contact_right}</span>
									</div>
									<div class="w-full bg-base-300 rounded-full h-2">
										<div
											class="bg-primary h-2 rounded-full"
											style="width: {getStatBarWidth(item.contact_right)}"
										></div>
									</div>
								</div>
								<div>
									<div class="flex justify-between mb-1">
										<span>Power vs L</span>
										<span class="font-mono">{item.power_left}</span>
									</div>
									<div class="w-full bg-base-300 rounded-full h-2">
										<div
											class="bg-primary h-2 rounded-full"
											style="width: {getStatBarWidth(item.power_left)}"
										></div>
									</div>
								</div>
								<div>
									<div class="flex justify-between mb-1">
										<span>Power vs R</span>
										<span class="font-mono">{item.power_right}</span>
									</div>
									<div class="w-full bg-base-300 rounded-full h-2">
										<div
											class="bg-primary h-2 rounded-full"
											style="width: {getStatBarWidth(item.power_right)}"
										></div>
									</div>
								</div>
								<div>
									<div class="flex justify-between mb-1">
										<span>Vision</span>
										<span class="font-mono">{item.plate_vision}</span>
									</div>
									<div class="w-full bg-base-300 rounded-full h-2">
										<div
											class="bg-primary h-2 rounded-full"
											style="width: {getStatBarWidth(item.plate_vision)}"
										></div>
									</div>
								</div>
							</div>
						</div>
					{:else}
						<div class="mb-6">
							<h3 class="text-lg font-semibold mb-2">Pitching</h3>
							<div class="space-y-3">
								<div>
									<div class="flex justify-between mb-1">
										<span>Stamina</span>
										<span class="font-mono">{item.stamina}</span>
									</div>
									<div class="w-full bg-base-300 rounded-full h-2">
										<div
											class="bg-primary h-2 rounded-full"
											style="width: {getStatBarWidth(item.stamina)}"
										></div>
									</div>
								</div>
								<div>
									<div class="flex justify-between mb-1">
										<span>Velocity</span>
										<span class="font-mono">{item.pitch_velocity}</span>
									</div>
									<div class="w-full bg-base-300 rounded-full h-2">
										<div
											class="bg-primary h-2 rounded-full"
											style="width: {getStatBarWidth(item.pitch_velocity)}"
										></div>
									</div>
								</div>
								<div>
									<div class="flex justify-between mb-1">
										<span>Control</span>
										<span class="font-mono">{item.pitch_control}</span>
									</div>
									<div class="w-full bg-base-300 rounded-full h-2">
										<div
											class="bg-primary h-2 rounded-full"
											style="width: {getStatBarWidth(item.pitch_control)}"
										></div>
									</div>
								</div>
								<div>
									<div class="flex justify-between mb-1">
										<span>Movement</span>
										<span class="font-mono">{item.pitch_movement}</span>
									</div>
									<div class="w-full bg-base-300 rounded-full h-2">
										<div
											class="bg-primary h-2 rounded-full"
											style="width: {getStatBarWidth(item.pitch_movement)}"
										></div>
									</div>
								</div>
							</div>
						</div>
					{/if}

					<div class="mb-6">
						<h3 class="text-lg font-semibold mb-2">Fielding</h3>
						<div class="space-y-3">
							<div>
								<div class="flex justify-between mb-1">
									<span>Fielding</span>
									<span class="font-mono">{item.fielding_ability}</span>
								</div>
								<div class="w-full bg-base-300 rounded-full h-2">
									<div
										class="bg-primary h-2 rounded-full"
										style="width: {getStatBarWidth(item.fielding_ability)}"
									></div>
								</div>
							</div>
							<div>
								<div class="flex justify-between mb-1">
									<span>Arm Strength</span>
									<span class="font-mono">{item.arm_strength}</span>
								</div>
								<div class="w-full bg-base-300 rounded-full h-2">
									<div
										class="bg-primary h-2 rounded-full"
										style="width: {getStatBarWidth(item.arm_strength)}"
									></div>
								</div>
							</div>
							<div>
								<div class="flex justify-between mb-1">
									<span>Reaction</span>
									<span class="font-mono">{item.reaction_time}</span>
								</div>
								<div class="w-full bg-base-300 rounded-full h-2">
									<div
										class="bg-primary h-2 rounded-full"
										style="width: {getStatBarWidth(item.reaction_time)}"
									></div>
								</div>
							</div>
						</div>
					</div>

					<div>
						<h3 class="text-lg font-semibold mb-2">Running</h3>
						<div class="space-y-3">
							<div>
								<div class="flex justify-between mb-1">
									<span>Speed</span>
									<span class="font-mono">{item.speed}</span>
								</div>
								<div class="w-full bg-base-300 rounded-full h-2">
									<div
										class="bg-primary h-2 rounded-full"
										style="width: {getStatBarWidth(item.speed)}"
									></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Right Column: Additional Details -->
			<div class="space-y-6">
				<!-- Physical Details Card -->
				<div class="card bg-base-200 shadow-xl">
					<div class="card-body">
						<h3 class="card-title mb-2">Physical Details</h3>
						<div class="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span class="text-secondary">Age:</span>
								{item.age}
							</div>
							<div>
								<span class="text-secondary">Height:</span>
								{item.height}
							</div>
							<div>
								<span class="text-secondary">Weight:</span>
								{item.weight}
							</div>
							<div>
								<span class="text-secondary">Born:</span>
								{item.born}
							</div>
							<div>
								<span class="text-secondary">Bats:</span>
								{item.bat_hand}
							</div>
							<div>
								<span class="text-secondary">Throws:</span>
								{item.throw_hand}
							</div>
							<div>
								<span class="text-secondary">Jersey #:</span>
								{item.jersey_number}
							</div>
						</div>
					</div>
				</div>

				<!-- Pitches Card (if pitcher) -->
				{#if item.pitches && item.pitches.length > 0}
					<div class="card bg-base-200 shadow-xl">
						<div class="card-body">
							<h3 class="card-title mb-2">Pitches</h3>
							<table class="table table-sm table-zebra w-full">
								<thead>
									<tr>
										<th>Pitch</th>
										<th>Velocity</th>
										<th>Control</th>
										<th>Movement</th>
									</tr>
								</thead>
								<tbody>
									{#each item.pitches as pitch}
										<tr>
											<td>{pitch.name}</td>
											<td>{pitch.speed}</td>
											<td>{pitch.control}</td>
											<td>{pitch.movement}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				{/if}

				<!-- Quirks Card -->
				{#if item.quirks && item.quirks.length > 0}
					<div class="card bg-base-200 shadow-xl">
						<div class="card-body">
							<h3 class="card-title mb-2">Quirks</h3>
							<div class="space-y-3">
								{#each item.quirks as quirk}
									<div class="flex items-start gap-3">
										<img src={quirk.img} alt={quirk.name} class="w-8 h-8 mt-1" />
										<div>
											<h4 class="font-semibold">{quirk.name}</h4>
											<p class="text-sm opacity-75">{quirk.description}</p>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
