<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Plus from 'lucide-svelte/icons/plus';

	export let data;

	console.log(data);
</script>

<div class="container py-6 h-full">
	<h1 class="text-4xl font-medium">Ваши проекты</h1>

	<div class="grid grid-cols-4 gap-4 py-4">
		{#if data.projects?.length && data.projects !== undefined}
			{#each data.projects as project}
				<div class="col-span-1 h-16 border rounded-md">
					{project.name}
				</div>
			{/each}
		{/if}
		<div class="col-span-1 h-16 rounded-md">
			<Button variant="ghost" class="size-full">
				<Plus />
			</Button>
		</div>
	</div>
</div>
