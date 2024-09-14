<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { userStore } from '$lib/user.js';
	import Brackets from 'lucide-svelte/icons/brackets';

	export let data;
	if (data.ok && data.user) {
		console.info('Session verified.');
		$userStore = data.user;
	}
</script>

<div class="flex flex-col h-screen">
	<header class="py-2 border-b">
		<div class="container mx-auto flex justify-between items-center">
			<h1 class="font-medium text-xl" title="Название проекта" aria-label="Название проекта">
				Skala
			</h1>
			<div class="space-x-2">
				<Button href="/app">
					<Brackets class="size-4 mr-2" />
					Проекты
				</Button>
			</div>
		</div>
	</header>

	<slot />
</div>
