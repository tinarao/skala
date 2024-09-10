<script>
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Button from './ui/button/button.svelte';
	import GripHorizontal from 'lucide-svelte/icons/grip-horizontal';

	/** @type {import('$lib/typedefs').Task} Task */
	export let task;
</script>

<Collapsible.Root>
	<div class="p-2 border rounded-md">
		<div class="flex items-center justify-between">
			<h6 class="font-medium">{task.name}</h6>
			<Collapsible.Trigger asChild let:builder>
				<Button size="icon" variant="ghost_gray" builders={[builder]}>
					<GripHorizontal class="size-4" />
				</Button>
			</Collapsible.Trigger>
		</div>
		<Collapsible.Content>
			<hr class="my-1" />
			<p class="text-sm font-medium">
				{task.description}
			</p>
		</Collapsible.Content>
	</div>
</Collapsible.Root>
<!-- </div> -->
