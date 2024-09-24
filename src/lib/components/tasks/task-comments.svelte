<script>
	import { userStore } from '$lib/user';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Button from '../ui/button/button.svelte';

	import LoaderIcon from 'lucide-svelte/icons/loader-circle';
	import ArrowUpIcon from 'lucide-svelte/icons/arrow-big-up';

	import AvatarPlaceholder from '../../../assets/avatar-ph.jpg';

	/** @type {import("$lib/typedefs").Comment[]}*/
	let comments = [];
	let isLoading = false;

	let comment = '';

	onMount(async () => {
		if (taskId === 0) {
			goto('/app');
			return;
		}

		const res = await fetch(`/api/projects/tasks/comments?task=${taskId}`);
		const resData = await res.json();

		comments = resData.comments;
	});

	async function handleCreateComment() {
		isLoading = true;

		try {
			const res = await fetch('/api/projects/tasks/comments', {
				method: 'POST',
				body: JSON.stringify({
					comment: z.string().max(120, 'Слишком длинный комментарий'),
					taskId: z.number(),
					projectId: z.number()
				})
			});
		} finally {
			isLoading = false;
		}
	}

	/** @type {number}*/
	export let taskId;
</script>

<div>
	<h5 class="font-medium text-sm">{comments.length} комментариев</h5>
	<div class="flex items-center">
		<img
			class="size-8 rounded-full"
			src={$userStore.picture ?? AvatarPlaceholder}
			alt="Аватар пользователя {$userStore.username}"
		/>
		<textarea
			bind:value={comment}
			rows="3"
			maxlength="120"
			disabled={isLoading}
			class="border-b p-2 bg-background outline-none w-full resize-none"
		/>
	</div>
	<div class="flex justify-end">
		<Button
			on:click={handleCreateComment}
			disabled={isLoading}
			size="sm"
			variant="outline"
			class="my-2 ml-auto"
		>
			{#if isLoading}
				<LoaderIcon class="size-4 mr-1 animate-spin" />
			{:else}
				<ArrowUpIcon class="size-4 mr-1" />
			{/if}
			Отправить
		</Button>
	</div>
	{#each comments as comment}
		<div>
			{comment.body}
		</div>
	{/each}
</div>
