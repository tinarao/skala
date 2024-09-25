<script>
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import Icon from 'lucide-svelte/icons/hand-heart';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	/** @type {string}*/
	let username;
	/** @type {string}*/
	let password;
	let isLoading = false;
</script>

<title>Регистрация - Skala</title>
<h1 class="text-2xl font-medium">Регистрация</h1>
<form
	method="POST"
	action="?/register"
	use:enhance={({ formData }) => {
		if (!username || !password) {
			toast.error('Проверьте правильность введённых данных');
			return;
		}

		formData.append('username', username);
		formData.append('password', password);

		return async ({ update }) => {
			isLoading = true;
			await update();

			if ($page.status !== 200) {
				toast.error($page.form.message);
				isLoading = false;
				return;
			}

			if ($page.status === 200) {
				toast.success('Успешно!');
				isLoading = false;
				goto('/app');
			}
		};
	}}
>
	<div>
		<Label>Имя пользователя</Label>
		<Input disabled={isLoading} class="w-96" bind:value={username} />
	</div>
	<div>
		<Label>Пароль</Label>
		<Input disabled={isLoading} type="password" class="w-96" bind:value={password} />
	</div>

	<hr class="my-2" />

	<div class="flex justify-between">
		<Button disabled={isLoading} type="submit">
			{#if isLoading}
				<LoaderCircle class="size-4 mr-2 animate-spin" />
			{:else}
				<Icon class="size-4 mr-2" />
			{/if}
			Зарегистрироваться
		</Button>
		<Button disabled={isLoading} variant="link" href="/login">У меня есть аккаунт</Button>
	</div>
</form>
