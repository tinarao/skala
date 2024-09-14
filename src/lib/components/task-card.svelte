<script>
	import * as Collapsible from '$lib/components/ui/collapsible';
	import TaskInfoSheet from './task-info-sheet.svelte';
	import Button from './ui/button/button.svelte';
	import GripHorizontal from 'lucide-svelte/icons/grip-horizontal';
	import Menu from 'lucide-svelte/icons/menu';

	/** @type {import('$lib/typedefs').Task} Task */
	export let task;
</script>

<Collapsible.Root>
	<div class="p-2 border rounded-md">
		<div class="flex items-center justify-between">
			<h6 class="font-medium">{task.name}</h6>
			<div>
				{#if task.description}
					<Collapsible.Trigger asChild let:builder>
						<Button size="icon" variant="ghost_gray" builders={[builder]}>
							<GripHorizontal class="size-4" />
						</Button>
					</Collapsible.Trigger>
				{/if}
				<TaskInfoSheet {task}>
					<Button size="icon" variant="ghost">
						<Menu class="size-4" />
					</Button>
				</TaskInfoSheet>
			</div>
		</div>

		{#if task.description}
			<Collapsible.Content>
				<div class="line-clamp-2">
					<hr class="my-1" />
					<p class="text-sm font-medium">
						{task.description}
					</p>
				</div>
			</Collapsible.Content>
		{/if}
	</div>
</Collapsible.Root>
<!-- </div> -->
