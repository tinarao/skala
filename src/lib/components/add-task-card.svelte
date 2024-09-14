<script>
	import Input from './ui/input/input.svelte';
	import Button from './ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Label from './ui/label/label.svelte';
	import { toast } from 'svelte-sonner';
	import { invalidate } from '$app/navigation';

	/** @type {string} */
	let taskName = '';

	async function submit() {
		if (taskName === '') {
			toast.error('Вы не указали название задачи!');
			return;
		}

		const res = await fetch('/api/projects/tasks', {
			method: 'POST',
			body: JSON.stringify({
				projectId: projectId,
				name: taskName
			})
		});

		const resData = await res.json();
		if (!res.ok) {
			toast.error('Ошибка при создании задачи');
			return;
		}

		invalidate('tasks:fetch');
		toast.success('Задача создана!');
		return;
	}

	/** @type {number} */
	export let projectId;
</script>

<Dialog.Root>
	<Dialog.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost_gray" class="justify-center w-full" size="lg">
			Добавить
		</Button>
	</Dialog.Trigger>
	<Dialog.Content class="w-12">
		<Dialog.Header>
			<Dialog.Title>Создать задачу</Dialog.Title>
		</Dialog.Header>

		<div>
			<Label>Название задачи</Label>
			<Input bind:value={taskName} placeholder="Помыть посуду" />
		</div>

		<Button class="w-fit" on:click={submit}>Создать</Button>
	</Dialog.Content>
</Dialog.Root>
