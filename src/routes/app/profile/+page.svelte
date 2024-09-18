<script>
	import Upload from 'lucide-svelte/icons/upload';
	import AvatarPlaceholder from '../../../assets/avatar-ph.jpg';
	import Button from '$lib/components/ui/button/button.svelte';
	import { userStore } from '$lib/user';
	import { goto } from '$app/navigation';

	/** @type {HTMLInputElement} */
	let input;

	/** @type {string | undefined}*/
	let newAvatarUrl = undefined;
	let isAvatarChanged = false;

	/** @type {File | undefined} */
	let picToUpload = undefined;

	export let data;

	function handleSelectFile() {
		if (!input.files) {
			return;
		}

		if (!input.files.length) {
			return;
		}

		const file = input.files[0];

		const url = URL.createObjectURL(file);
		newAvatarUrl = url;
		isAvatarChanged = true;

		picToUpload = file;
		return;
	}

	async function handleSaveChanges() {
		if (!picToUpload) {
			return;
		}

		const formdata = new FormData();
		formdata.append('file', picToUpload);

		const res = await fetch('/api/user/avatar', {
			method: 'PATCH',
			body: formdata
		});

		const resData = await res.json();
	}

	async function handleLogout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		goto('/login');
	}
</script>

<title>{$userStore.username} - Skala</title>
<img
	class="size-32 rounded-full"
	src={isAvatarChanged
		? (newAvatarUrl ?? AvatarPlaceholder)
		: (data.user.picture ?? AvatarPlaceholder)}
	alt="Аватар пользователя {$userStore.username}"
/>
<input
	on:input={handleSelectFile}
	accept="image/*"
	bind:this={input}
	type="file"
	aria-hidden="true"
	class="hidden"
/>
<div class="flex items-center">
	<Button on:click={() => input.click()}>
		<Upload class="size-4 mr-2" /> Выбрать файл
	</Button>
	{#if isAvatarChanged}
		<Button on:click={handleSaveChanges}>Сохранить</Button>
	{/if}
</div>
<h1>{$userStore.username}</h1>
<Button on:click={handleLogout} variant="destructive">Выйти</Button>
