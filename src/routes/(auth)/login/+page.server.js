import { db } from '$lib/db/db';
import { users } from '$lib/db/schema';
import { redis } from '$lib/redis';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import bcryptjs from 'bcryptjs';

/** @type {import('./$types').Actions} */
export const actions = {
    login: async (event) => {
        const formdata = await event.request.formData();
        const username = formdata.get('username')
        const password = formdata.get('password')

        if (!username) {
            return fail(400, { username, missing: true })
        }

        if (!password) {
            return fail(400, { password, missing: true })
        }

        const user = await db.query.users.findFirst({
            where: (user, { eq }) => eq(user.username, username.toString())
        });

        if (!user) {
            return fail(404, { user, missing: true })
        }

        const isValidPassword = await bcryptjs.compare(password.toString(), user.password)
        if (!isValidPassword) {
            return fail(401, { password, invalid: true })
        }

        const sessionId = nanoid(32);
        const redisResult = await redis.set(sessionId, user.id, { ex: 60 * 60 * 24 });
        if (redisResult !== 'OK') {
            return fail(500)
        }

        event.cookies.set('session_id', sessionId, { path: '/' });
        event.cookies.set('id', user.id.toString(), { path: '/' });

        await db
            .update(users)
            .set({ sessionId: sessionId })
            .where(eq(users.id, user.id))
            .returning();

        return { success: true }
    }
};