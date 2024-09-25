<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import Placeholder from '../../assets/project-ph.jpg';
	import Plus from 'lucide-svelte/icons/plus';
	import { Progress } from '$lib/components/ui/progress';
	import CreateProjectForm from '$lib/components/projects/create-project-form.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select';

	export let data;

	/** @type {"all" | "done" | "active"}*/
	let filter = 'all';

	onMount(() => {
		if (!data.projects.length && !data.collabs.length) {
			goto('/app/create');
		}
	});

	/**
	 * @param {"all" | "done" | "active"} filter
	 * @returns {import("$lib/typedefs").Project[]} projects
	 */
	const filterProjects = (filter) => {
		switch (filter) {
			case 'all':
				return data.projects;
			case 'active':
				return data.projects.filter((p) => p.percentage < 100);
			case 'done':
				return data.projects.filter((p) => p.percentage === 100);
		}
	};

	$: projects = filterProjects(filter);
</script>

<title>Проекты - Skala</title>
<div class="h-full py-2">
	<h1 class="text-4xl font-medium">Проекты</h1>
	<div class="w-full py-2">
		<Select.Root onSelectedChange={(e) => (filter = e?.value)}>
			<Select.Trigger class="w-[180px]">
				<Select.Value placeholder="Фильтр" />
			</Select.Trigger>
			<Select.Content class="bg-background text-text">
				<Select.Item value="done">Завершённые</Select.Item>
				<Select.Item value="active">Активные</Select.Item>
				<Select.Item value="all">Все</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>

	<div class="grid grid-cols-4 gap-4 py-2">
		{#if data.projects?.length && data.projects !== undefined}
			{#each projects as project}
				<a
					href="/app/project?id={project.id}"
					class="col-span-1 border rounded-md hover:shadow-md transition hover:bg-neutral-800"
				>
					<div class="h-60 w-full">
						<img
							class="size-full object-cover"
							src={project.picture ?? Placeholder}
							alt="Проект {project.name}"
						/>
					</div>
					<div class="p-2">
						<h6 class="font-medium text-lg">{project.name}</h6>
					</div>
					<hr class="my-1" />
					<div class="p-2 mb-3 space-y-1">
						<span class="font-medium">Прогресс: {project.percentage}%</span>
						<Progress value={project.percentage} />
					</div>
				</a>
			{/each}
		{/if}
		<div class="col-span-1 h-16 rounded-md">
			<Dialog.Root>
				<Dialog.Trigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" class="size-full">
						<Plus />
					</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Создать проект</Dialog.Title>
					</Dialog.Header>
					<CreateProjectForm />
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>

	{#if data.collabs && data.collabs.length}
		<hr class="my-2" />
		<h3 class="font-medium text-xl">Совместная работа</h3>
		<div class="grid grid-cols-4 gap-4 py-2">
			{#if data.projects?.length && data.projects !== undefined}
				{#each data.collabs as collab}
					<a
						href="/app/project?id={collab.project.id}"
						class="col-span-1 border rounded-md hover:shadow-md transition hover:bg-neutral-800"
					>
						<img src={Placeholder} alt="Проект {collab.project.name}" loading="lazy" />
						<div class="p-2">
							<h6 class="font-medium text-lg">{collab.project.name}</h6>
						</div>
						<hr class="my-1" />
						<div class="p-2 mb-3 space-y-1">
							<span class="font-medium">Прогресс: {collab.project.percentage}%</span>
							<Progress value={collab.project.percentage} />
						</div>
					</a>
				{/each}
			{/if}
		</div>
	{/if}
</div>
