<script>
	import * as Popover from '$lib/components/ui/popover';
	import Button from '../ui/button/button.svelte';
	import AvatarPlaceholder from '../../../assets/avatar-ph.jpg';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	let isLoading = false;

	/** @param {number} id */
	async function handleDelete(id) {
		isLoading = true;
		try {
			const res = await fetch(`/api/projects/invitations/${projectId}?user=${id}`, {
				method: 'DELETE'
			});
			const resData = await res.json();
			if (!res.ok) {
				toast.error(resData.message);
				return;
			}

			toast.success('Удалено!');
			return;
		} finally {
			isLoading = false;
			invalidateAll();
		}
	}

	/** @type {number} */
	export let projectId;

	/** @type {import("$lib/typedefs").UserPicNameId[]} */
	export let invites;
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" size="sm">Приглашения</Button>
	</Popover.Trigger>
	<Popover.Content align="end" class="bg-background text-text space-y-2 w-96">
		<h6 class="font-medium">Ожидающие</h6>
		<p class="font-medium text-sm text-neutral-500">
			Вы отправили этим пользователям приглашения, но они их не приняли. Пока.
		</p>
		<div>
			{#each invites as user}
				<div class="flex justify-between items-center group h-12 rounded-md bg-neutral-700 p-2">
					<div class="flex items-center gap-x-2">
						<img
							src={user.picture ?? AvatarPlaceholder}
							alt="Аватар пользователя {user.username}"
							class="size-8 rounded-full"
						/>
						<h6 class="font-medium">{user.username}</h6>
					</div>
					<Button
						disabled={isLoading}
						on:click={() => handleDelete(user.id)}
						size="sm"
						variant="ghost"
						class="group-hover:inline-flex hidden hover:bg-red-500 hover:text-white"
						>Отменить</Button
					>
				</div>
			{/each}
		</div>
		<hr />
		<h6 class="font-medium">Коллабораторы</h6>
		<p class="font-medium text-sm text-neutral-500">Активные коллабораторы</p>
	</Popover.Content>
</Popover.Root>
