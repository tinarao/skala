<script>
	import * as Card from '$lib/components/ui/card';

	import Button from '$lib/components/ui/button/button.svelte';
	import { userStore } from '$lib/user.js';
	import Brackets from 'lucide-svelte/icons/brackets';
	import AvatarPlaceholder from '../../assets/avatar-ph.jpg';

	export let data;
	$userStore = data.user;
</script>

<div class="flex flex-col h-screen">
	<div class="grid grid-cols-7 flex-1">
		<aside class="col-span-1 flex flex-col justify-between border-r p-4">
			<div class="space-y-1">
				<h1 class="my-4">Skala</h1>
				<Button size="lg" class="justify-start w-full" variant="ghost" href="/app/profile">
					<img
						src={data.user?.picture ?? AvatarPlaceholder}
						class="size-5 mr-2 rounded-full"
						alt="Аватар пользователя {data.user?.username}"
					/> Профиль
				</Button>
				<Button size="lg" class="justify-start w-full" variant="ghost" href="/app">
					<Brackets class="size-5 mr-2" /> Проекты
				</Button>
			</div>
			<Card.Root class="bg-background text-text">
				<Card.Header>
					<Card.Title>CTA Карточка</Card.Title>
					<Card.Description>Описание CTA</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>Какой нибудь CTA текст</p>
				</Card.Content>
				<Card.Footer>
					<Button>Перейти</Button>
				</Card.Footer>
			</Card.Root>
		</aside>
		<div class="col-span-6 px-4">
			<slot />
		</div>
	</div>
</div>
