<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	import LoginIcon from 'lucide-svelte/icons/log-in';
	import LoaderIcon from 'lucide-svelte/icons/loader-circle';

	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	/** @type {string}*/
	let username;
	/** @type {string}*/
	let password;
	let isLoading = false;

	/** @param {number} status */
	const toasts = (status) => {
		if (status === 400) {
			toast.error('Проверьте правильность введённых данных и попробуйте снова.');
			return;
		}

		if (status === 401) {
			toast.error('Неверные имя пользователя и/или пароль');
			return;
		}

		if (status === 404) {
			toast.error('Пользователь не найден');
			return;
		}

		if (status === 200) {
			toast.success('Успешно!');
			return;
		}
	};
</script>

<title>Авторизация - Skala</title>
<h1 class="text-2xl font-medium">Авторизация</h1>
<form
	method="POST"
	action="?/login"
	use:enhance={({ formData }) => {
		if (!username || !password) {
			toast.error('Проверьте правильность введённых данных');
			return;
		}

		formData.append('username', username);
		formData.append('password', password);

		return async ({ update }) => {
			await update();
			toasts($page.status);

			isLoading = false;
			if ($page.status === 200) {
				goto('/app');
			}
		};
	}}
>
	<div>
		<Label>Имя пользователя</Label>
		<Input class="w-96" bind:value={username} />
	</div>
	<div>
		<Label>Пароль</Label>
		<Input type="password" class="w-96" bind:value={password} />
	</div>

	<hr class="my-2" />

	<div class="flex justify-between">
		<Button type="submit" disabled={isLoading}>
			{#if isLoading}
				<LoaderIcon class="size-4 mr-2 animate-spin" />
			{:else}
				<LoginIcon class="size-4 mr-2" />
			{/if}
			Войти
		</Button>
		<Button variant="link" href="/register">У меня нет аккаунта</Button>
	</div>
</form>
