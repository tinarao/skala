import { z } from 'zod';
import { db } from '$lib/db/db';
import { tasks, users } from '$lib/db/schema';
import { taskValidator } from '$lib/validators';
import { eq } from 'drizzle-orm';

const createTaskDTO = z.object({
	projectId: z.number().positive(),
	name: z.string()
});

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const taskId = url.searchParams.get('task');

	return new Response(JSON.stringify(taskId), { status: 200 });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const data = await request.json();

	const taskDto = createTaskDTO.safeParse(data);
	if (!taskDto.success) {
		return new Response(
			JSON.stringify({
				message: 'Некорректный запрос',
				errors: taskDto.error.message
			}),
			{ status: 400 }
		);
	}

	const saved = await db
		.insert(tasks)
		.values({
			name: taskDto.data.name,
			projectId: taskDto.data.projectId
		})
		.returning();

	return new Response(JSON.stringify(saved), { status: 200 });
}

/** @type {import('./$types').RequestHandler} */
export async function PATCH({ request }) {
	const payload = await request.json();
	const { data: newTask, success, error } = taskValidator.safeParse(payload);
	if (!success) {
		return new Response(JSON.stringify({ message: 'Некорректный запрос' }), { status: 400 });
	}

	const updatedTask = await db
		.update(tasks)
		.set({
			name: newTask.name,
			status: newTask.status,
			priority: newTask.priority,
			description: newTask.description
		})
		.where(eq(tasks.id, newTask.id))
		.returning();

	return new Response(JSON.stringify(updatedTask), { status: 200 });
}
