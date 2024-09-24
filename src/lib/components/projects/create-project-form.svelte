<script>
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Calendar } from '$lib/components/ui/calendar/index.js';

	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { toast } from 'svelte-sonner';
	import { goto, invalidateAll } from '$app/navigation';

	/** @type {import("@internationalized/date").DateValue | undefined}*/
	let date = undefined;
	let remind = false;
	let isLoading = false;

	let name = '';

	const df = new DateFormatter('ru-RU', {
		dateStyle: 'full'
	});

	async function submit() {
		isLoading = true;
		try {
			const values = {
				deadline: date ? new Date(date.toString()) : undefined,
				remind,
				name
			};

			const res = await fetch('/api/projects', {
				method: 'POST',
				body: JSON.stringify(values)
			});

			const resData = await res.json();
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
		}
	}
</script>

<div class="space-y-2">
	<div class="space-y-1">
		<Label>Введите название проекта</Label>
		<Input disabled={isLoading} bind:value={name} />
	</div>
	<!-- <div class="grid space-y-1">
		<Label>Когда дедлайн?</Label>
		<Popover.Root>
			<Popover.Trigger asChild let:builder>
				<Button
					variant="outline"
					class={cn('m-0 justify-start text-left font-normal', !date && 'text-muted-foreground')}
					builders={[builder]}
				>
					<CalendarIcon class="mr-2 h-4 w-4" />
					{date ? df.format(date.toDate(getLocalTimeZone())) : 'Pick a date'}
				</Button>
			</Popover.Trigger>
			<Popover.Content class="w-auto p-0">
				<Calendar bind:value={date} initialFocus />
			</Popover.Content>
		</Popover.Root>
	</div> -->
	<div class="flex items-center">
		<Checkbox disabled={isLoading} bind:checked={remind} class="mr-2" />
		<Label>Напоминать Вам о задачах?</Label>
	</div>
	<hr class="my-2" />
	<Button size="lg" on:click={submit} disabled={isLoading}>Создать</Button>
</div>
