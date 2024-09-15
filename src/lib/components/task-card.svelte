<script>
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { onMount } from 'svelte';
	import TaskInfoSheet from './task-info-sheet.svelte';
	import Button from './ui/button/button.svelte';
	import GripHorizontal from 'lucide-svelte/icons/grip-horizontal';
	import Menu from 'lucide-svelte/icons/menu';
	import { dndTask } from '$lib/db/dnd';

	/** @type {import('$lib/typedefs').Task} Task */
	export let task;

	onMount(() => {
		const dndDiv = document.getElementById(`task-${task.id}`);
		if (!dndDiv) {
			return;
		}
		dndDiv.addEventListener('dragstart', () => {
			const taskId = dndDiv.textContent?.split(' ')[0];
			if (!taskId) return;

			$dndTask = { task: task, dragging: true };
			return;
		});

		dndDiv.addEventListener('dragend', () => {
			const taskId = dndDiv.textContent?.split(' ')[0];
			if (!taskId) return;

			$dndTask = { task: undefined, dragging: false };
			return;
		});
	});
</script>

<Collapsible.Root>
	<div role="listitem" id="task-{task.id}" draggable="true" class="task-card p-2 border rounded-md">
		<span class="hidden" aria-hidden="true">{task.id}</span>
		<div class="flex items-center justify-between">
			<h6 class="font-medium">{task.id} - {task.name}</h6>
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
