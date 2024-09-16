<script>
	import { userStore } from '$lib/user';
	import { onMount } from 'svelte';
	import Button from '../ui/button/button.svelte';
	import { goto } from '$app/navigation';

	/** @type {import("$lib/typedefs").Comment[]}*/
	let comments = [];

	onMount(async () => {
		if (taskId === 0) {
			goto('/app');
			return;
		}

		const res = await fetch(`/api/projects/tasks/comments?task=${taskId}`);
		const resData = await res.json();

		console.log(resData);
		comments = resData.comments;
	});

	/** @type {number}*/
	export let taskId;
</script>

<div>
	<h5 class="font-medium text-sm">{comments.length} комментариев</h5>
	<div class="flex items-center">
		<img
			src={$userStore.picture}
			class="size-8 rounded-full"
			alt="Аватар пользователя {$userStore.username}"
		/>
		<textarea
			rows="3"
			maxlength="120"
			class="border-b p-2 bg-background outline-none w-full resize-none"
		/>
	</div>
	<div class="flex justify-end">
		<Button size="sm" variant="outline" class="my-2 ml-auto">Отправить</Button>
	</div>
	{#each comments as comment}
		<div>
			{comment.body}
		</div>
	{/each}
</div>
