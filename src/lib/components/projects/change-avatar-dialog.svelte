<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import ImagePlus from 'lucide-svelte/icons/image-plus';
	import Upload from 'lucide-svelte/icons/upload';
	import { toast } from 'svelte-sonner';

	import { Save, Clock, LoaderCircle as LoaderIcon } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';

	/** @type {File | undefined} */
	let picToUpload = undefined;

	/** @type {HTMLInputElement} */
	let input;

	/** @type {string | undefined}*/
	let newArtworkUrl = undefined;

	let isLoading = false;
	let isAvatarChanged = false;

	async function handleSelectFile() {
		isLoading = true;
		if (!input.files) {
			return;
		}

		if (!input.files.length) {
			return;
		}

		const file = input.files[0];

		const url = URL.createObjectURL(file);
		newArtworkUrl = url;
		isAvatarChanged = true;

		picToUpload = file;
		isLoading = false;
		return;
	}

    async function handleSaveChanges() {
		isLoading = true
		if (!picToUpload) {
			return;
		}

		const formdata = new FormData();
		formdata.append('file', picToUpload);
        formdata.append('projectId', projectId.toString())

		const res = await fetch('/api/projects/artwork', {
			method: 'PATCH',
			body: formdata
		});

		isLoading = false
		await invalidateAll();
		toast.success("Сохранено!");

		return;
	}

	/** @type {number} */
	export let projectId;
</script>

<Dialog.Root>
	<Dialog.Trigger asChild let:builder>
		<Button variant="ghost" size="icon" builders={[builder]}>
			<ImagePlus class="size-4" />
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Изменение заставки</Dialog.Title>
			<Dialog.Description>Выберите изображение</Dialog.Description>
		</Dialog.Header>
		<div class="flex items-center justify-between">
			<Button disabled={isLoading} on:click={() => input.click()}>
				<Upload class="size-4 mr-2" /> Выбрать файл
			</Button>
			<input
				on:input={handleSelectFile}
				accept="image/*"
				bind:this={input}
				type="file"
				aria-hidden="true"
				class="hidden"
			/>
			<Button
				on:click={handleSaveChanges}
				variant={!(isAvatarChanged && newArtworkUrl) ? 'outline' : 'default'}
				disabled={!(isAvatarChanged && newArtworkUrl) || isLoading}
				class="w-32"
			>
				{#if isAvatarChanged && newArtworkUrl}
					<Save class="size-4 mr-2" /> Сохранить
				{:else if isLoading}
					<LoaderIcon class="size-4 mr-2 animate-spin" /> Загрузка
				{:else}
					<Clock class="size-4 mr-2" /> Ждём...
				{/if}
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
