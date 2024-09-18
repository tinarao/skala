<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	import LoginIcon from 'lucide-svelte/icons/log-in';
	import LoaderIcon from 'lucide-svelte/icons/loader-circle';

	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/user';

	/** @type {string}*/
	let username;
	/** @type {string}*/
	let password;
	let isLoading = false;

	async function handleLogin() {
		isLoading = true;
		try {
			if (!username || !password) {
				toast.error('Пожалуйста, заполните все поля');
				return;
			}

			if (password.length < 8) {
				toast.error('Слишком короткий пароль');
				return;
			}

			const res = await fetch('/api/auth/login', {
				method: 'POST',
				body: JSON.stringify({ username, password })
			});

			const resData = await res.json();
			if (!res.ok) {
				toast.error(resData.message);
				return;
			}

			toast.success('Успешно!');
			//TODO: DEBUG $userStore = resData

			goto('/app');
			return;
		} finally {
			isLoading = false;
		}
	}
</script>

<title>Авторизация - Skala</title>
<h1 class="text-2xl font-medium">Авторизация</h1>
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
	<Button on:click={handleLogin} disabled={isLoading}>
		{#if isLoading}
			<LoaderIcon class="size-4 mr-2 animate-spin" />
		{:else}
			<LoginIcon class="size-4 mr-2" />
		{/if}
		Войти
	</Button>
	<Button variant="link" href="/register">У меня нет аккаунта</Button>
</div>
