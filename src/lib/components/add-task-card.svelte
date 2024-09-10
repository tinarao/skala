<script>
	import Button from './ui/button/button.svelte';

	/** @type {"done" | "not_started" | "in_progress" | "scrapped"}  */
	export let status;
</script>

<Button variant="ghost_gray" class="justify-center w-full" size="lg">Добавить</Button>
