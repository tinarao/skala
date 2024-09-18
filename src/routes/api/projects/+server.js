import { db } from '$lib/db/db';
import { nanoid } from 'nanoid';
import { redis } from '$lib/redis';
import { z } from 'zod';
import { projects, users } from '$lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { projectValidator } from '$lib/validators';

const CreateProjectDTO = z.object({
	name: z.ostring(),
	remind: z.boolean().default(false),
	deadline: z.coerce.date({ message: 'Некорректная дата' })
});

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
	const { data: values, error, success } = CreateProjectDTO.safeParse(await request.json());

	if (!success) {
		return new Response(JSON.stringify(error.issues), { status: 400 });
	}

	/** @type { number } */
	let userId;
	const cookieId = cookies.get('id');
	const cookieSessionId = cookies.get('session_id');

	if (!cookieId) {
		if (!cookieSessionId) {
			return new Response(JSON.stringify({ message: 'Ошибка авторизации' }), { status: 401 });
		}

		const userIdRedis = await redis.get(cookieSessionId);
		userId = parseInt(userIdRedis);
	} else {
		userId = parseInt(cookieId);
	}

	const user = await db.query.users.findFirst({
		where: (user, { eq }) => eq(user.id, userId),
		with: {
			projects: true
		}
	});

	if (!user) {
		return new Response(JSON.stringify({ message: 'Ошибка авторизации' }), { status: 401 });
	}

	const saved = await db.insert(projects).values({
		name: values.name ?? `Проект №${user?.projects.length}`,
		deadline: values.deadline.toISOString(),
		createdAt: new Date().toISOString(),
		authorId: user.id,
		percentage: 0,
		remind: values.remind
	});

	return new Response(JSON.stringify(saved), { status: 201 });
}

/** @type {import('./$types').RequestHandler} */
export async function PATCH({ request, cookies }) {
	const payload = projectValidator.safeParse(await request.json());
	if (!payload.success) {
		return new Response(JSON.stringify(payload.error), { status: 400 })
	}

	const cookieId = cookies.get("id");
	const cookieSid = cookies.get("session_id");

	if (!cookieId) {
		return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 401 })
	}

	if (!cookieSid) {
		return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 401 })
	}

	const redisUserId = await redis.get(cookieSid);
	if (redisUserId != cookieId) {
		return new Response(JSON.stringify({ "message": "Не авторизован" }), { status: 401 })
	}

	const created = await db.insert(projects).set({
		name: payload.data.name,
		remind: payload.data.remind,
		percentage: payload.data.percentage
	}).where(eq(projects.id, payload.data.id)).returning();

	return new Response(JSON.stringify(created), { status: 201 })
}	