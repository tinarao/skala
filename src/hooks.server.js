import { db } from '$lib/db/db';
import { redis } from '$lib/redis';
import { redirect } from '@sveltejs/kit';
import { and } from 'drizzle-orm';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    if (event.url.pathname.startsWith('/app') || event.url.pathname.startsWith('/api')) {
        const sessionId = event.cookies.get('session_id');

        if (!sessionId) {
            return redirect(302, "/login")
        }

        const redisResponse = await redis.get(sessionId);
        if (!redisResponse) {
            return redirect(302, "/login")
        }

        const userId = parseInt(redisResponse)

        const user = await db.query.users.findFirst({
            where: (user, { eq }) => and(
                eq(user.id, userId),
                eq(user.sessionId, sessionId)
            ),
            columns: {
                id: true,
                picture: true,
                username: true
            }
        })

        if (!user) {
            return redirect(302, "/login");
        }

        event.locals.user = user;
    }

    return await resolve(event);
}