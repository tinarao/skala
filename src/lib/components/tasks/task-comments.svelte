<script>
	import { userStore } from '$lib/user';
	import { goto, invalidateAll } from '$app/navigation';
	import Button from '../ui/button/button.svelte';
	import LoaderIcon from 'lucide-svelte/icons/loader-circle';
	import ThumbsUp from 'lucide-svelte/icons/thumbs-up';
	import ArrowUpIcon from 'lucide-svelte/icons/arrow-big-up';
	import AvatarPlaceholder from '../../../assets/avatar-ph.jpg';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';

	let isLoading = false;
	let comment = '';

	async function handleCreateComment() {
		isLoading = true;

		try {
			if (!comment || comment.length === 0) {
				toast.error('Нельзя оставить пустой комментарий!');
				return;
			}
			const urlParams = new URLSearchParams(window.location.search);
			const projectId = urlParams.get('id');
			if (!projectId) {
				goto('/app');
				return;
			}

			const res = await fetch('/api/projects/tasks/comments', {
				method: 'POST',
				body: JSON.stringify({
					comment,
					taskId,
					projectId: parseInt(projectId) // get from url
				})
			});
			const data = await res.json();
			if (!res.ok) {
				toast.error(data.message);
				return;
			}

			await invalidateAll();
			toast.success('Готово!');
			comment = '';
			return;
		} finally {
			isLoading = false;
		}
	}

	/** @type {number}*/
	export let taskId;

	/** @type {import("$lib/typedefs").Comment[]}*/
	export let comments;
</script>

<div>
	<h4 class="font-medium text-xl">Комментарии</h4>
	<span class=" font-medium text-sm">
		{comments.length} комментариев
	</span>
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
		<div class="flex border-b-2 p-2 space-x-2">
			<img
				class="size-6 rounded-full"
				src={comment.author.picture ?? AvatarPlaceholder}
				alt="Аватар пользователя {comment.author.username}"
			/>
			<div>
				<h6 class="font-[600] text-sm text-muted-foreground">
					{comment.author.username}
				</h6>
				<p>
					{comment.body}
				</p>
			</div>
		</div>
	{/each}
</div>
