<script>
	import AddTaskCard from '$lib/components/add-task-card.svelte';
	import TaskCard from '$lib/components/task-card.svelte';
	import { taskStatus } from '$lib/db/enums';

	export let data;
	// // Попробую когда-нибудь починить это уёбище
	// // Сейчас лениво
	$: done = data.project.tasks.filter((t) => t.status === 'done');
	$: inProgress = data.project.tasks.filter((t) => t.status === taskStatus.InProgress);
	$: notStarted = data.project.tasks.filter((t) => t.status === 'not_started');
	$: scrapped = data.project.tasks.filter((t) => t.status === taskStatus.Scrapped);
</script>

<title>Проект {data.project.name} - Skala</title>
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
			<AddTaskCard projectId={data.project.id} />
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
		</div>
	</div>
</div>
