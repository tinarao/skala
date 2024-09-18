<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from './ui/button/button.svelte';
	import Pen from 'lucide-svelte/icons/pen-line';
	import Input from './ui/input/input.svelte';
	import { Label } from './ui/label';
	import { toast } from 'svelte-sonner';
	import { goto, invalidate } from '$app/navigation';

	/** @type {import ("$lib/typedefs").Project}*/
	export let project;

	let name = project.name ?? 'Проект';

	async function handleSaveChanges() {
		const payload = {
			...project,
			name
		};
		const res = await fetch('/api/projects', {
			method: 'PATCH',
			body: JSON.stringify(payload)
		});
		if (!res.ok) {
			toast.error('Ошибка при обновлении проекта');

			if (res.status === 401) {
				goto('/login');
			}

			return;
		}

		toast.success('Проект успешно изменён!');
		invalidate('tasks:fetch');
		return;
	}
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button variant="ghost" size="icon"><Pen class="size-4" /></Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Проект {project.name}</Dialog.Title>
			<Dialog.Description
				>Окно изменения проекта. Перечислить все возможности изменить проект</Dialog.Description
			>
		</Dialog.Header>
		<div>
			<Label>Переименовать проект</Label>
			<Input bind:value={name} />
		</div>
		<hr class="my-1" />
		<div class="flex items-center justify-between">
			<Button on:click={handleSaveChanges}>Сохранить</Button>
			<Dialog.Close asChild let:builder>
				<Button variant="destructive" builders={[builder]}>Отменить</Button>
			</Dialog.Close>
		</div>
	</Dialog.Content>
</Dialog.Root>
