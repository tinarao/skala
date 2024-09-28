<script>
	import * as Sheet from '$lib/components/ui/sheet';
	import { toast } from 'svelte-sonner';
	import { Textarea } from './ui/textarea';
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import Button from './ui/button/button.svelte';
	import TaskComments from './tasks/task-comments.svelte';
	import { onMount } from 'svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import * as Select from '$lib/components/ui/select';
	import Label from './ui/label/label.svelte';
	import { priorityTranslations } from '$lib/priority';

	/** @type {import("$lib/typedefs").Task}*/
	export let task;

	let isLoading = false;
	let isEditingDescription = false;
	let desc = task.description;

	onMount(() => {
		if (!task.id) {
			goto('/app');
			return;
		}
	});

	async function editDescription() {
		const res = await fetch('/api/projects/tasks', {
			method: 'PATCH',
			body: JSON.stringify({ ...task, description: desc })
		});

		const resData = await res.json();
		if (!res.ok) {
			toast.error('Ошибка при обновлении задачи');
			isEditingDescription = false;
			return;
		}

		invalidate('tasks:fetch');
		toast.success('Задача обновлена!');

		isEditingDescription = false;
		return;
	}

	/** @param {string} newPriority*/
	async function handleChangeTaskPriority(newPriority) {
		const res = await fetch('/api/projects/tasks', {
			method: 'PATCH',
			body: JSON.stringify({ ...task, priority: newPriority })
		});

		const resData = await res.json();
		if (!res.ok) {
			toast.error('Ошибка при обновлении задачи');
			isEditingDescription = false;
			return;
		}

		invalidate('tasks:fetch');
		toast.success('Задача обновлена!');

		isEditingDescription = false;
		return;
	}

	async function handleDeleteTask() {
		isLoading = true;
		try {
			const res = await fetch(`/api/projects/tasks?task=${task.id}`, {
				method: 'DELETE'
			});
			if (!res.ok) {
				const data = await res.json();
				if (res.status === 401) {
					await fetch('/api/auth/logout', { method: 'POST' });
					goto('/login');
					return;
				}

				toast.error(data.message);
				return;
			}

			toast.success('Задача удалена!');
			invalidateAll();
			return;
		} finally {
			isLoading = false;
		}
	}
</script>

<Sheet.Root>
	<Sheet.Trigger>
		<slot />
	</Sheet.Trigger>
	<Sheet.Content class="flex flex-col justify-between">
		<Sheet.Header>
			<h3 class="font-medium text-2xl">{task.name}</h3>
		</Sheet.Header>
		<div class="h-full py-8">
			<div>
				<div class="grid">
					<h4 class="font-medium text-xl">Описание</h4>
					{#if task.description}
						<p class="my-1 p-2 bg-neutral-900 rounded-md">
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
				<div class="space-y-2">
					<h4 class="font-medium text-xl">Приоритет</h4>
					<p>
						Текущий: {#if isLoading}
							Загрузка...
						{:else}
							{priorityTranslations[task.priority]}
						{/if}
					</p>
					<div>
						<Label>Изменить</Label>
						<Select.Root onSelectedChange={(e) => handleChangeTaskPriority(e?.value)}>
							<Select.Trigger class="border-border">
								<Select.Value placeholder="Приоритет" />
							</Select.Trigger>
							<Select.Content class="bg-background text-text">
								<Select.Item value="low">Низкий</Select.Item>
								<Select.Item value="normal">Обычный</Select.Item>
								<Select.Item value="high">Высокий</Select.Item>
								<Select.Item value="ultra">Ультра</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
				</div>
				<hr class="my-2" />
				<TaskComments comments={task.comments} taskId={task.id ?? 0} />
			</div>
		</div>
		<Button variant="destructive" on:click={handleDeleteTask}>
			{#if isLoading}
				<LoaderCircle class="size-4 animate-spin" />
			{:else}
				Удалить задачу
			{/if}
		</Button>
	</Sheet.Content>
</Sheet.Root>
