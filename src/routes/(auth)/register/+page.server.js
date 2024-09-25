import { db } from '$lib/db/db';
import { users } from '$lib/db/schema';
import { redis } from '$lib/redis';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import bcryptjs from 'bcryptjs';

/** @type {import('./$types').Actions} */
export const actions = {
    register: async (event) => {
        const formdata = await event.request.formData();
        const username = formdata.get('username')
        const password = formdata.get('password')

        if (!username) {
            return fail(400, { message: "Имя пользователя отсутствует!" })
        }

        if (!password) {
            return fail(400, { message: "Пароль отсутствует!" })
        }

        if (password.toString().length < 8) {
            return fail(400, { message: "Слишком короткий пароль!" })
        }

        const duplicate = await db.query.users.findFirst({
            where: (user, { eq }) => eq(user.username, username.toString())
        });

        if (duplicate) {
            return fail(400, { message: "Такой пользователь уже существует" })
        }

        const salt = bcryptjs.genSaltSync();
        const hash = bcryptjs.hashSync(password.toString(), salt);

        const doc = {
            password: hash,
            username: username.toString()
        };
        const created = await db.insert(users).values(doc).onConflictDoNothing().returning();

        // login
        const sessionId = nanoid(32);
        const redisResult = await redis.set(sessionId, created[0].id, { ex: 60 * 60 * 24 });
        if (redisResult !== 'OK') {
            return fail(500)
        }

        event.cookies.set('session_id', sessionId, { path: '/' });
        event.cookies.set('id', created[0].id.toString(), { path: '/' });

        const updated = await db
            .update(users)
            .set({ sessionId: sessionId })
            .where(eq(users.id, created[0].id))
            .returning();

        return { success: true };
    }
};