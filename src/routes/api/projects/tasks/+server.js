import { z } from 'zod';
import { db } from '$lib/db/db';
import { tasks, users } from '$lib/db/schema';
import { taskValidator } from '$lib/validators';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '$lib/server/auth-mw';

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
		.returning()

	return new Response(JSON.stringify({ updatedTask }), { status: 200 });
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ cookies, url }) {
	const isAllowed = await authMiddleware(cookies);
	if (!isAllowed) {
		return new Response(JSON.stringify({ "message": "Не авторизован" }), { status: 401 })
	}

	const taskId = url.searchParams.get('task');
	if (!taskId) {
		return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 400 })
	}

	const cookieId = cookies.get('id')
	if (!cookieId) {
		return new Response(JSON.stringify({ "message": "Не авторизован" }), { status: 401 })
	}

	const [user, task] = await Promise.all([
		db.query.users.findFirst({
			where: (user, { eq }) => eq(user.id, parseInt(cookieId))
		}),
		db.query.tasks.findFirst({
			where: (task, { eq }) => eq(task.id, parseInt(taskId)),
			with: { project: { columns: { id: true, authorId: true } } }
		})
	])

	if (!user || !task) {
		return new Response(JSON.stringify({ "message": "Задача не найдена" }), { status: 404 })
	}

	if (task.project?.authorId !== user.id) {
		return new Response(JSON.stringify({ "message": "Запрещено" }), { status: 403 })
	}

	await db.delete(tasks).where(eq(tasks.id, task.id));
	return new Response(JSON.stringify({ "message": "Удалено!" }), { status: 200 })
}