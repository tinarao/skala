<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Placeholder from '../../assets/project-ph.jpg';
	import Plus from 'lucide-svelte/icons/plus';
	import { Progress } from '$lib/components/ui/progress';
	import { userStore } from '$lib/user';

	export let data;
	const userId = $userStore.id;
</script>

<div class="container py-6 h-full">
	<h1 class="text-4xl font-medium">Ваши проекты</h1>

	<div class="grid grid-cols-4 gap-4 py-4">
		{#if data.projects?.length && data.projects !== undefined}
			{#each data.projects as project}
				<a
					href="/app/project?id={project.id}&u={userId}"
					class="col-span-1 border rounded-md hover:shadow-md transition hover:bg-neutral-800"
				>
					<img src={Placeholder} alt="Проект {project.name}" />
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
			<Button variant="ghost" class="size-full">
				<Plus />
			</Button>
		</div>
	</div>
</div>
