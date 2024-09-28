<script>
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	import { toast } from 'svelte-sonner';
	import { Textarea } from '../ui/textarea';
	import { LoaderCircle } from 'lucide-svelte';
	import { goto, invalidateAll } from '$app/navigation';

	/** @type {import("@internationalized/date").DateValue | undefined}*/
	let date = undefined;
	let remind = false;
	let isLoading = false;

	let name = '';

	/** @type {string | undefined}*/
	let description = undefined;

	async function submit() {
		if (!name || name === '') {
			toast.error('Вы не указали название проекта!');
			return;
		}

		isLoading = true;
		try {
			const values = {
				deadline: date ? new Date(date.toString()) : undefined,
				remind,
				description,
				name
			};

			const res = await fetch('/api/projects', {
				method: 'POST',
				body: JSON.stringify(values)
			});

			if (res.status !== 201) {
				if (res.status === 400) {
					toast.error('Вы заполнили все поля? Точно?');
					return;
				}

				if (res.status === 401) {
					await fetch('/api/auth/logout', { method: 'POST' });
					goto('/login');
				}
			}

			toast.success('Проект создан!');

			return;
		} finally {
			await invalidateAll();
			isLoading = false;

			goto('/app');
		}
	}
</script>

<div class="space-y-2">
	<div>
		<Label>Введите название проекта <span class="text-red-500">*</span></Label>
		<Input placeholder="Skala" disabled={isLoading} bind:value={name} />
	</div>
	<div>
		<Label title="Укажите описание проекта. Может быть полезно при командной работе">
			Описание проекта
		</Label>
		<Textarea
			maxLength={350}
			disabled={isLoading}
			bind:value={description}
			placeholder="Веб-приложение для продвинутого управления задачами"
		/>
	</div>
	<div class="flex items-center">
		<Checkbox disabled={isLoading} bind:checked={remind} class="mr-2" />
		<Label>Напоминать Вам о задачах?</Label>
	</div>
	<hr class="my-2" />
	<Button size="lg" class="w-28" on:click={submit} disabled={isLoading}>
		{#if isLoading}
			<LoaderCircle class="animate-spin size-4" />
		{:else}
			Создать
		{/if}
	</Button>
</div>
