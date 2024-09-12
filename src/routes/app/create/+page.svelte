<script>
	import * as Card from '$lib/components/ui/card';
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
	import { goto } from '$app/navigation';

	/** @type {import("@internationalized/date").DateValue | undefined}*/
	let date = undefined;
	let remind = false;

	let name = '';

	const df = new DateFormatter('ru-RU', {
		dateStyle: 'full'
	});

	async function submit() {
		if (!date) {
			return;
		}

		const values = {
			deadline: new Date(date.toString()),
			// deadline: 'sosi',
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

		goto('/app');
		return;
	}
</script>

<div class="flex items-center justify-center h-full">
	<Card.Root class="bg-background text-text border-border">
		<Card.Header>
			<Card.Title>Создание проекта</Card.Title>
			<Card.Description>Поднимите свою продуктивность с бесплатным сервисом</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-3">
			<div>
				<Label>Введите название проекта</Label>
				<Input bind:value={name} />
			</div>
			<div class="grid">
				<Label>Когда дедлайн?</Label>

				<Popover.Root>
					<Popover.Trigger asChild let:builder>
						<Button
							variant="outline"
							class={cn('justify-start text-left font-normal', !date && 'text-muted-foreground')}
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
			</div>
			<div class="flex items-center">
				<Checkbox bind:checked={remind} class="mr-2" />
				<Label>Напоминать Вам о задачах?</Label>
			</div>
		</Card.Content>
		<hr class="my-2" />
		<Card.Footer class="pt-0 pb-2">
			<Button on:click={submit}>Создать</Button>
		</Card.Footer>
	</Card.Root>
</div>
