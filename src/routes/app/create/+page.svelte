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

	/** @type {import("@internationalized/date").DateValue | undefined}*/
	let value;
	let remind = false;

	let name = '';

	const df = new DateFormatter('ru-RU', {
		dateStyle: 'long'
	});

	async function submit() {
		if (!value) {
			return;
		}

		const date = df.format(value.toDate(getLocalTimeZone()));

		console.log({
			deadline: date,
			remind,
			name
		});
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
							class={cn(
								'mt-1 justify-start text-left font-normal',
								!value && 'text-muted-foreground'
							)}
							builders={[builder]}
						>
							<CalendarIcon class="mr-2 h-4 w-4" />
							{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
						</Button>
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0">
						<Calendar bind:value initialFocus />
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
