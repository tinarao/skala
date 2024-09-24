<script>
	import { goto } from '$app/navigation';
	import Button from './ui/button/button.svelte';

	let isLoading = false;

	async function handleLogout() {
		isLoading = true;
		await fetch('/api/auth/logout', { method: 'POST' });
		goto('/login');
		isLoading = false;
	}

	/** @type {"default" | "icon" | "lg" | "sm"}*/
	export let size = 'icon';

	export let large = false;
</script>

<Button
	class={large ? 'w-60' : ''}
	disabled={isLoading}
	{size}
	on:click={handleLogout}
	variant="destructive">Выйти</Button
>
