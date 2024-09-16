<script>
	import * as Sheet from '$lib/components/ui/sheet';
	import { toast } from 'svelte-sonner';
	import { Label } from './ui/label';
	import { Textarea } from './ui/textarea';
	import { invalidate } from '$app/navigation';
	import Button from './ui/button/button.svelte';

	/** @type {import("$lib/typedefs").Task}*/
	export let task;

	let isEditingDescription = false;
	let desc = task.description;

	async function editDescription() {
		const res = await fetch('/api/projects/tasks', {
			method: 'PATCH',
			body: JSON.stringify({ ...task, description: desc })
		});

		const resData = await res.json();
		if (!res.ok) {
			console.error(resData);
			toast.error('Ошибка при обновлении задачи');
			isEditingDescription = false;
			return;
		}

		invalidate('tasks:fetch');
		toast.success('Задача обновлена!');

		isEditingDescription = false;
		return;
	}
</script>

<Sheet.Root>
	<Sheet.Trigger>
		<slot />
	</Sheet.Trigger>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>
				{task.name}
			</Sheet.Title>
		</Sheet.Header>
		<div class="h-full py-8">
			<div class="grid">
				<Label>Описание</Label>
				{#if task.description}
					<p>
						{task.description}
					</p>
				{:else if isEditingDescription}
					<Textarea maxlength="300" rows="10" bind:value={desc} class="my-2 h-fit"></Textarea>
					<div class="flex items-center gap-x-2">
						<Button class="w-full" size="sm" on:click={editDescription}>Сохранить</Button>
						<Button
							class="w-full"
							size="sm"
							on:click={() => (isEditingDescription = false)}
							variant="destructive">Отменить</Button
						>
					</div>
				{:else}
					<Button
						on:click={() => (isEditingDescription = true)}
						class="w-fit my-2"
						variant="outline">Добавить описание</Button
					>
				{/if}
			</div>
			<hr class="my-2" />
		</div>
	</Sheet.Content>
</Sheet.Root>
