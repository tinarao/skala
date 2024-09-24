<script>
	import Button from '$lib/components/ui/button/button.svelte';

	import LayoutPanelIcon from 'lucide-svelte/icons/layout-panel-left';
	import LandingPeopleDrawing from '../assets/landing_dudes_working.svg';
</script>

<main class="flex flex-col items-center justify-center h-screen bg-white">
	<div class="text-center">
		<h1
			class="bg-gradient-to-r from-indigo-600 via-sky-400 to-emerald-400 text-transparent bg-clip-text"
		>
			<span class="text-7xl font-[800]">Управляйте проектами</span><br />
			<span class="text-2xl">как никогда раньше</span>
		</h1>
		<img src={LandingPeopleDrawing} alt="Мужчина и женщина планируют проект на Skala" />
		<p class="text-black font-medium text-lg my-2">
			Бесплатный сервис для удобного и эффективного управления проектами
		</p>
	</div>
	<Button href="/app" size="lg" variant="outline" class="bg-transparent text-black">
		<LayoutPanelIcon class="size-5 mr-2" />
		Начать работу
	</Button>
</main>
