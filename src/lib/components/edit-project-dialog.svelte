<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from './ui/button/button.svelte';
	import Pen from 'lucide-svelte/icons/pen-line';
	import SaveIcon from 'lucide-svelte/icons/save';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import Input from './ui/input/input.svelte';
	import { Label } from './ui/label';
	import { toast } from 'svelte-sonner';
	import { goto, invalidate } from '$app/navigation';
	import { initialState, userStore } from '$lib/user';
	import { Textarea } from './ui/textarea';

	/** @type {import ("$lib/typedefs").Project}*/
	export let project;

	let isLoading = false;
	let name = project.name ?? 'Проект';

	/** @type {string | undefined}*/
	let description = project.description ?? undefined;

	async function handleSaveChanges() {
		isLoading = true;

		try {
			const payload = {
				...project,
				name,
				description
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
		} finally {
			isLoading = false;
		}
	}

	async function handleDeleteProject() {
		isLoading = true;
		try {
			const res = await fetch(`/api/projects/${project.id}`, {
				method: 'DELETE'
			});
			if (!res.ok) {
				const data = await res.json();
				toast.error(data.message);

				if (res.status === 401) {
					await fetch('/api/auth/logout', { method: 'POST' });
					$userStore = initialState;
					goto('/login');

					return;
				}

				return;
			}

			toast.success('Проект успешно удалён!');
			goto('/app');
		} finally {
			isLoading = false;
		}
	}
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button variant="ghost" size="icon"><Pen class="size-4" /></Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{project.name}</Dialog.Title>
			<Dialog.Description
				>Окно изменения проекта. Перечислить все возможности изменить проект</Dialog.Description
			>
		</Dialog.Header>
		<div>
			<Label>Переименовать проект</Label>
			<Input disabled={isLoading} bind:value={name} />
		</div>
		<div>
			<Label>Изменить описание</Label>
			<Textarea maxLength={350} rows="5" disabled={isLoading} bind:value={description} />
		</div>
		<hr class="my-1" />
		<div class="flex items-center justify-between">
			<Button disabled={isLoading} on:click={handleSaveChanges}>
				{#if isLoading}
					<LoaderCircle class="size-4 mr-2 animate-spin" />
				{:else}
					<SaveIcon class="size-4 mr-2" />
				{/if}
				Сохранить
			</Button>
			<Dialog.Close asChild let:builder>
				<Button disabled={isLoading} variant="outline" builders={[builder]}>Отменить</Button>
			</Dialog.Close>
		</div>
		<hr class="my-1" />
		<div class="flex items-center justify-between border rounded-md p-3">
			<div>
				<p class="text-red-500 font-medium">Удалить проект</p>
				<p class="text-xs">Это действие невозможно отменить!</p>
			</div>
			<Button
				disabled={isLoading}
				class="w-32"
				variant="destructive"
				on:click={handleDeleteProject}
			>
				{#if isLoading}
					<LoaderCircle class="size-4 animate-spin" />
				{:else}
					Удалить
				{/if}
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
