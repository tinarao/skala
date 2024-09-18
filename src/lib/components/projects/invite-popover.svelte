<script>
	import * as Popover from '$lib/components/ui/popover';
	import { toast } from 'svelte-sonner';
	import Button from '../ui/button/button.svelte';
	import Input from '../ui/input/input.svelte';
	import Label from '../ui/label/label.svelte';
	import SmilePlus from 'lucide-svelte/icons/smile-plus';
	import LoadingIcon from 'lucide-svelte/icons/loader-circle';
	import { invalidateAll } from '$app/navigation';

	/** @type {string} */
	let username;
	let isLoading = false;

	async function handleInvite() {
		if (!username || username === '') {
			toast.error('Вы забыли указать имя пользователя!');
			return;
		}

		try {
			isLoading = true;
			const res = await fetch('/api/projects/invitations', {
				method: 'POST',
				body: JSON.stringify({
					projectId,
					userToInviteUsername: username
				})
			});

			const resData = await res.json();

			if (!res.ok) {
				if (res.status === 404 || res.status === 403) {
					toast.error(resData.message);
					return;
				}

				toast.error('Ошибка при приглашении пользователя. Мы уже всё чиним!');
				return;
			}

			toast.success('Приглашение отправлено!');
			return;
		} finally {
			isLoading = false;
			invalidateAll();
		}
	}

	/** @type {number}*/
	export let projectId;
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button size="sm" variant="outline" builders={[builder]}>Пригласить</Button>
	</Popover.Trigger>
	<Popover.Content align="end" class="bg-background text-text space-y-2 w-96">
		<h6 class="font-medium">Пригласить коллаборатора</h6>
		<p class="font-medium text-sm text-neutral-500">
			Вы можете пригласить другого пользователя в проект для совместной работы. Коллаборатор сможет
			просматривать проект, изменять статус задач, писать комментарии.
		</p>
		<hr />
		<div>
			<Label>Имя пользователя</Label>
			<Input disabled={isLoading} placeholder="tinarao" bind:value={username} />
		</div>
		<Button disabled={isLoading} on:click={handleInvite} size="lg" class="w-full">
			{#if isLoading}
				<LoadingIcon class="size-4 mr-2 animate-spin" />
			{:else}
				<SmilePlus class="size-4 mr-2" />
			{/if}
			Отправить
		</Button>
	</Popover.Content>
</Popover.Root>
