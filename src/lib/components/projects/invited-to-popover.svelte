<script>
	import * as Popover from '$lib/components/ui/popover';
	import { userStore } from '$lib/user';
	import { toast } from 'svelte-sonner';
	import Button from '../ui/button/button.svelte';
	import GridPlus from 'lucide-svelte/icons/grid-2x2-plus';
	import { invalidateAll } from '$app/navigation';

	/** @type{import("$lib/typedefs").Invite[]}*/
	export let invites;

	let isLoading = false;

	/** @param {number} projectId*/
	async function handleDeleteInvite(projectId) {
		toast.info('Удаляем...');
		isLoading = true;
		try {
			const res = await fetch(`/api/projects/invitations/${projectId}?user=${$userStore.id}`, {
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

	/** @param {number} projectId*/
	async function handleAcceptInvite(projectId) {
		isLoading = true;

		try {
			const res = await fetch('/api/projects/invitations', {
				method: 'PATCH',
				body: JSON.stringify({
					projectId: projectId,
					userId: $userStore.id
				})
			});

			const resData = await res.json();
			if (!res.ok) {
				toast.error(resData.message);
				return;
			}

			toast.success('Успешно!');
			await invalidateAll();
			return;
		} finally {
			isLoading = false;
		}
	}
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button size="lg" class="flex justify-start w-full" variant="ghost" builders={[builder]}>
			<div class="flex items-center">
				<GridPlus class="size-5 mr-2" />
				Приглашения
			</div>
			{#if invites.length > 0}
				<div class="flex items-center justify-center ml-auto size-5 bg-red-500 rounded-full">
					<span class="text-xs">
						{#if invites.length >= 10}
							9+
						{:else}
							{invites.length}
						{/if}
					</span>
				</div>
			{/if}
		</Button>
	</Popover.Trigger>
	<Popover.Content align="start" class="bg-background text-text space-y-2">
		<h6 class="font-medium">Пригласить коллаборатора</h6>
		<p class="font-medium text-sm text-neutral-500">Вас ждут в этих проектах</p>
		<hr />

		{#if invites.length}
			{#each invites as invite}
				<div class="bg-neutral-900 p-2 rounded-md grid">
					<h5 class="font-medium">{invite.project.name}</h5>
					<span class="mb-2 text-xs">
						Готов на {invite.project.percentage}%
					</span>
					<div class="flex items-center justify-center gap-x-2">
						<Button
							disabled={isLoading}
							class="hover:bg-green-400 w-full"
							size="sm"
							variant="outline"
							on:click={() => handleAcceptInvite(invite.projectId)}>Принять</Button
						>
						<Button
							disabled={isLoading}
							class="hover:bg-red-400 w-full"
							size="sm"
							variant="outline"
							on:click={() => handleDeleteInvite(invite.projectId)}>Отклонить</Button
						>
					</div>
				</div>
			{/each}
		{:else}
			<div class="flex items-center justify-center bg-neutral-900 p-2 rounded-md font-medium">
				<h6>Здесь пусто!</h6>
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>
