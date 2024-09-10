<script>
	import AddTaskCard from '$lib/components/add-task-card.svelte';
	import TaskCard from '$lib/components/task-card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { taskStatus } from '$lib/db/enums';
	import { project } from '$lib/mock';

	// Попробую когда-нибудь починить это уёбище
	// Сейчас лениво
	$: done = project.tasks.filter((t) => t.status === taskStatus.Done);
	$: inProgress = project.tasks.filter((t) => t.status === taskStatus.InProgress);
	$: notStarted = project.tasks.filter((t) => t.status === taskStatus.NotStarted);
	$: scrapped = project.tasks.filter((t) => t.status === taskStatus.Scrapped);
</script>

<div class="grid grid-cols-4 gap-x-4 flex-1 container mx-auto py-4">
	<div class="col-span-1 h-full p-4">
		<div class="flex items-center bg-teal-900 p-3 rounded-md space-x-2">
			<div class="bg-teal-500 rounded-full size-4"></div>
			<h3 class="font-medium">Ожидают</h3>
		</div>
		<hr class="my-2" />
		<div class="space-y-2">
			{#each notStarted as task}
				<TaskCard {task} />
			{/each}
			<AddTaskCard status="not_started" />
		</div>
	</div>
	<div class="col-span-1 p-4">
		<div class="flex items-center bg-orange-900 p-3 rounded-md space-x-2">
			<div class="bg-orange-500 rounded-full size-4"></div>
			<h3 class="font-medium">Выполняются</h3>
		</div>
		<hr class="my-2" />
		<div class="space-y-2">
			{#each inProgress as task}
				<TaskCard {task} />
			{/each}
			<AddTaskCard status="in_progress" />
		</div>
	</div>
	<div class="col-span-1 p-4">
		<div class="flex items-center bg-green-900 p-3 rounded-md space-x-2">
			<div class="bg-green-500 rounded-full size-4"></div>
			<h3 class="font-medium">Выполненные</h3>
		</div>
		<hr class="my-2" />
		<div class="space-y-2">
			{#each done as task}
				<TaskCard {task} />
			{/each}
			<AddTaskCard status="done" />
		</div>
	</div>
	<div class="col-span-1 p-4">
		<div class="flex items-center bg-red-900 p-3 rounded-md space-x-2">
			<div class="bg-red-500 rounded-full size-4"></div>
			<h3 class="font-medium">Заброшенные</h3>
		</div>
		<hr class="my-2" />
		<div class="space-y-2">
			{#each scrapped as task}
				<TaskCard {task} />
			{/each}
			<AddTaskCard status="scrapped" />
		</div>
	</div>
</div>
