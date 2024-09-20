<script>
	import * as Card from '$lib/components/ui/card';
	import CreateProjectForm from '$lib/components/projects/create-project-form.svelte';
</script>

<div class="flex items-center justify-center h-full">
	<Card.Root class="bg-background text-text border-border">
		<Card.Header>
			<Card.Title>Создание проекта</Card.Title>
			<Card.Description>Поднимите свою продуктивность с бесплатным сервисом</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-3">
			<CreateProjectForm />
		</Card.Content>
	</Card.Root>
</div>
