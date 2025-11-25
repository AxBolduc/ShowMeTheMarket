<script lang="ts">
	import type { MyPackSchema } from '$lib/schemas/packs';
	import type { z } from 'zod';

	type Pack = z.infer<typeof MyPackSchema>;

	// Props definition
	let {
		pack, // Pack data
		onClick = undefined // Click handler (optional)
	} = $props<{
		pack: Pack;
		onClick?: () => void;
	}>();

	// Handle keyboard navigation
	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onClick?.();
		}
	}
</script>

<div
	class="card bg-base-200 border border-base-300 shadow-lg hover:shadow-xl
         transition-all duration-300 ease-in-out cursor-pointer
         hover:scale-105 hover:border-primary
         text-center w-full h-full"
	onclick={onClick ?? (() => console.log('Pack clicked:', pack.id))}
	onkeydown={handleKeyDown}
	aria-label={`Open ${pack.name} pack`}
	role="button"
	tabindex="0"
>
	<figure class="px-5 pt-5 pb-2">
		<img
			src={pack.img}
			alt={pack.name}
			class="rounded-lg object-contain h-40 w-full"
			loading="lazy"
		/>
	</figure>

	<div class="card-body p-4 gap-1">
		<h3 class="card-title text-lg justify-center">{pack.name}</h3>

		<div class="mt-2 flex justify-center">
			<span class="badge badge-lg badge-primary">{pack.qty}x</span>
		</div>
	</div>

	<div
		class="absolute inset-0 bg-primary/10 opacity-0 hover:opacity-100
              rounded-lg transition-opacity duration-300 flex items-center justify-center"
	>
		<span class="btn btn-primary">Open Pack</span>
	</div>
</div>
