<script>
	import { invalidate } from '$app/navigation';
	import AddTaskCard from '$lib/components/add-task-card.svelte';
	import TaskCard from '$lib/components/task-card.svelte';
	import { dndTask } from '$lib/db/dnd.js';
	import { taskStatus } from '$lib/db/enums';
	import { toast } from 'svelte-sonner';
	import EditProjectDialog from '$lib/components/edit-project-dialog.svelte';

	export let data;
	// // Попробую когда-нибудь починить это уёбище
	// // Сейчас лениво
	$: done = data.project.tasks.filter((t) => t.status === 'done');
	$: inProgress = data.project.tasks.filter((t) => t.status === taskStatus.InProgress);
	$: notStarted = data.project.tasks.filter((t) => t.status === 'not_started');
	$: scrapped = data.project.tasks.filter((t) => t.status === taskStatus.Scrapped);

	/** @param {DragEvent & {
		currentTarget: EventTarget & HTMLDivElement;
	}} ev*/
	function handleDragOver(ev) {
		const container = ev.currentTarget;
		container.classList.add('bg-neutral-900');
		return;
	}

	/** @param {DragEvent & {
		currentTarget: EventTarget & HTMLDivElement;
	}} ev*/
	function handleDragLeave(ev) {
		ev.currentTarget.classList.remove('bg-neutral-900');
		return;
	}

	/** @param {DragEvent & {
		currentTarget: EventTarget & HTMLDivElement;
	}} ev*/
	async function handleDrop(ev) {
		const targetElement = ev.currentTarget;

		const res = await fetch('/api/projects/tasks', {
			method: 'PATCH',
			body: JSON.stringify({ ...$dndTask.task, status: targetElement.id })
		});

		if (!res.ok) {
			const resData = await res.json();
			toast.error('Ошибка при изменении статуса задачи. Попробуйте позже.');
			return;
		}

		invalidate('tasks:fetch');
		targetElement.classList.remove('bg-neutral-900');
		return;
	}
</script>

<title>Проект {data.project.name} - Skala</title>
<div class="flex flex-col h-full">
	<header class="flex justify-between items-center border-b py-1">
		<h3 title="Название проекта" class="font-medium text-xl">{data.project.name}</h3>
		<EditProjectDialog project={data.project} />
	</header>
	<div id="dnd-cols-wrapper" class="grid grid-cols-4 gap-x-4 flex-1">
		<div
			role="list"
			on:dragover|preventDefault={(ev) => handleDragOver(ev)}
			on:dragleave={(ev) => handleDragLeave(ev)}
			on:drop={(ev) => handleDrop(ev)}
			id="not_started"
			class="col-span-1 h-full p-4 rounded-md transition duration-300"
		>
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
		<div
			role="list"
			on:dragover|preventDefault={(ev) => handleDragOver(ev)}
			on:dragleave={(ev) => handleDragLeave(ev)}
			on:drop={(ev) => handleDrop(ev)}
			id="in_progress"
			class="col-span-1 p-4 transition duration-300"
		>
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
		<div
			role="list"
			on:dragover|preventDefault={(ev) => handleDragOver(ev)}
			on:dragleave={(ev) => handleDragLeave(ev)}
			on:drop={(ev) => handleDrop(ev)}
			id="done"
			class="col-span-1 p-4 transition duration-300"
		>
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
		<div
			role="list"
			on:dragover|preventDefault={(ev) => handleDragOver(ev)}
			on:dragleave={(ev) => handleDragLeave(ev)}
			on:drop={(ev) => handleDrop(ev)}
			id="scrapped"
			class="col-span-1 p-4 transition duration-300"
		>
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
</div>
