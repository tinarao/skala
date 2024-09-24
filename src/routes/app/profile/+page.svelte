<script>
	import Upload from 'lucide-svelte/icons/upload';
	import SaveIcon from 'lucide-svelte/icons/save';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import AvatarPlaceholder from '../../../assets/avatar-ph.jpg';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { userStore } from '$lib/user';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import LogoutButton from '$lib/components/logout-button.svelte';

	/** @type {HTMLInputElement} */
	let input;

	/** @type {string | undefined}*/
	let newAvatarUrl = undefined;
	let isAvatarChanged = false;

	/** @type {File | undefined} */
	let picToUpload = undefined;

	let isLoading = false;

	export let data;

	function handleSelectFile() {
		isLoading = true;
		if (!input.files) {
			return;
		}

		if (!input.files.length) {
			return;
		}

		const file = input.files[0];

		const fileSize = file.size / 1024 / 1024;
		if (fileSize > 3) {
			toast.error('Слишком большой файл! Максимально допустимый размер: 3 Мб.');
			return;
		}

		const url = URL.createObjectURL(file);
		newAvatarUrl = url;
		isAvatarChanged = true;

		picToUpload = file;
		isLoading = false;
		return;
	}

	async function handleSaveChanges() {
		isLoading = true;
		if (!picToUpload) {
			return;
		}

		const formdata = new FormData();
		formdata.append('file', picToUpload);

		toast.info('Загружаем...');
		const res = await fetch('/api/user/avatar', {
			method: 'PATCH',
			body: formdata
		});

		const resData = await res.json();
		isLoading = false;

		toast.success('Успешно!');
		await invalidateAll();
	}
</script>

<title>{$userStore.username} - Skala</title>
<div class="flex flex-col justify-between h-screen py-4">
	<div class="flex space-x-6">
		<div class="flex flex-col items-center space-y-2">
			<img
				loading="lazy"
				decoding="async"
				class="size-64 rounded-full"
				src={isAvatarChanged
					? (newAvatarUrl ?? AvatarPlaceholder)
					: (data.user.picture ?? AvatarPlaceholder)}
				alt="Аватар пользователя {$userStore.username}"
			/>
			<div class="grid gap-y-1">
				<input
					on:input={handleSelectFile}
					accept="image/*"
					bind:this={input}
					type="file"
					aria-hidden="true"
					class="hidden"
				/>
				<Button size="lg" disabled={isLoading} on:click={() => input.click()}>
					{#if isLoading}
						<LoaderCircle class="size-4 mr-2 animate-spin" />
					{:else}
						<Upload class="size-4 mr-2" />
					{/if}
					Выбрать файл
				</Button>
				{#if isAvatarChanged}
					<Button size="lg" disabled={isLoading} on:click={handleSaveChanges}>
						{#if isLoading}
							<LoaderCircle class="size-4 mr-2 animate-spin" />
						{:else}
							<SaveIcon class="size-4 mr-2" />
						{/if}
						Сохранить
					</Button>
				{/if}
			</div>
		</div>
		<div>
			<h1 class="font-bold text-4xl">{data.user.username}</h1>
		</div>
	</div>

	<div class="space-y-1">
		<div class="flex justify-between items-center p-4 border rounded-md">
			<div>
				<h5 class="text-red-500 text-xl font-[600]">Выйти</h5>
				<span class="text-muted-foreground text-sm font-medium"> Выйти из учётной записи </span>
			</div>
			<LogoutButton large size="lg" />
		</div>

		<div class="flex justify-between items-center p-4 border rounded-md">
			<div>
				<h5 class="text-red-500 text-xl font-[600]">Удалить мои проекты</h5>
				<span class="text-muted-foreground text-sm font-medium">
					Устали от своих проектов? Просто безвозвратно удалите их!
				</span>
			</div>
			<Dialog.Root>
				<Dialog.Trigger asChild let:builder>
					<Button class="w-60" size="lg" builders={[builder]} variant="destructive"
						>Удалить мои проекты</Button
					>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Вы уверены?</Dialog.Title>
						<Dialog.Description>
							Это действие нельзя отменить. Вы точно хотите удалить все свои проекты?
						</Dialog.Description>
					</Dialog.Header>
					<div class="flex gap-x-4">
						<Button class="w-full" size="lg" variant="destructive">Удалить все проекты</Button>
						<Dialog.Close asChild let:builder>
							<Button size="lg" builders={[builder]} class="w-full">Нет, я передумал(а)</Button>
						</Dialog.Close>
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</div>

		<div class="flex justify-between items-center p-4 border rounded-md">
			<div>
				<h5 class="text-red-500 text-xl font-[600]">Удалить мой аккаунт</h5>
				<span class="text-muted-foreground text-sm font-medium">
					Удалите все свои данные, включая проекты, комментарии и задачи
				</span>
			</div>
			<Dialog.Root>
				<Dialog.Trigger asChild let:builder>
					<Button size="lg" class="w-60" builders={[builder]} variant="destructive"
						>Удалить мой аккаунт</Button
					>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Вы уверены?</Dialog.Title>
						<Dialog.Description>
							Это действие нельзя отменить. Вы точно хотите удалить все свои проекты?
						</Dialog.Description>
					</Dialog.Header>
					<div class="flex gap-x-4">
						<Button class="w-full" size="lg" variant="destructive">Удалить все проекты</Button>
						<Dialog.Close asChild let:builder>
							<Button builders={[builder]} class="w-full" size="lg">Нет, я передумал(а)</Button>
						</Dialog.Close>
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>
</div>
