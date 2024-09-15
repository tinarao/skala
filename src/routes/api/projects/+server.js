import { db } from '$lib/db/db';
import { nanoid } from 'nanoid';
import { redis } from '$lib/redis';
import { z } from 'zod';
import { projects, users } from '$lib/db/schema';
import { eq, sql } from 'drizzle-orm';

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
