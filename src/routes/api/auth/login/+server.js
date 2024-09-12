import { db } from '$lib/db/db';
import { nanoid } from 'nanoid';
import { redis } from '$lib/redis';
import { z } from 'zod';
import { users } from '$lib/db/schema';
import { eq, sql } from 'drizzle-orm';

const LoginDTO = z.object({
    username: z.string().min(2),
    password: z.string().min(8)
})

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {

    const { success, error, data: dto } = LoginDTO.safeParse(await request.json());
    if (!success) {
        return new Response(JSON.stringify(error.message), { status: 400 })
    }

    const user = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.username, dto.username)
    });

    if (!user) {
        return new Response(JSON.stringify({ "message": "Пользователь не найден" }), { status: 404 })
    }

    const sessionId = nanoid(32);
    const redisResult = await redis.set(sessionId, user.id, { ex: 60 * 60 * 24 });
    if (redisResult !== "OK") {
        return new Response(JSON.stringify({ "message": "Ошибка при авторизации. Попробуйте позже." }), { status: 500 })
    }

    cookies.set("session_id", sessionId, { path: '/' });
    cookies.set("id", user.id.toString(), { path: '/' });

    const updated = await db.update(users).set({ sessionId: sessionId }).where(eq(users.id, user.id)).returning();

    return new Response(JSON.stringify(updated), { status: 200 })
}