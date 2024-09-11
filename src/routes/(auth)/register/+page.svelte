<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { toast } from 'svelte-sonner';

	/** @type {string}*/
	let username;
	/** @type {string}*/
	let password;
	let isLoading = false;

	async function handleRegister() {
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

			const regResponse = await fetch('/api/auth/register', {
				method: 'POST',
				body: JSON.stringify({ username, password })
			});

			const regResData = await regResponse.json();
			if (!regResData.ok) {
				toast.error(regResData.message);
				return;
			}

			toast.success('Вы успешно зарегистрировались!');

			// Login
			const loginData = {
				username: regResData.created[0].username,
				password: regResData.created[0].password
			};

			const logResponse = await fetch('/api/auth/login', {
				method: 'POST',
				body: JSON.stringify(loginData)
			});

			if (!logResponse.ok) {
				// no actual fucking way any error can occur here
				// but anyways
				toast.error(
					'Произошла ошибка при автоматической авторизации. Попробуйте самостоятельно войти в аккаунт'
				);
				return;
			}

			goto('/app');
			return;
		} finally {
			isLoading = false;
		}
	}
</script>

<title>Регистрация - Skala</title>
<h1 class="text-2xl font-medium">Регистрация</h1>
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
	<Button on:click={handleRegister}>Зарегистрироваться</Button>
	<Button variant="link" href="/login">У меня есть аккаунт</Button>
</div>
