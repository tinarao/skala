import { db } from '$lib/db/db';
import { redis } from '$lib/redis';
import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
    console.time("session verifier")
    const sessionId = cookies.get('session_id');
    const cookieId = cookies.get('id');
    if (!sessionId) {
        console.timeEnd("session verifier")
        return redirect(302, '/login');
    }

    if (!cookieId) {
        const userId = await redis.get(sessionId)
        if (!userId || userId !== cookieId) {

            cookies.delete("session_id", { path: '/' });
            cookies.delete("id", { path: '/' });

            console.timeEnd("session verifier")
            return redirect(302, '/login');
        }

        const user = await db.query.users.findFirst({
            where: (user, { eq }) => eq(user.sessionId, sessionId)
        })

        if (!user) {
            console.timeEnd("session verifier")
            return redirect(302, '/login');
        }

        cookies.set('session_id', String(user.sessionId), { path: '/' })

        return { ok: true };
    } else {
        const userId = await redis.get(sessionId)
        if (!userId || userId !== parseInt(cookieId)) {
            cookies.delete("session_id", { path: '/' });
            cookies.delete("id", { path: '/' });

            console.timeEnd("session verifier")
            return redirect(302, '/login');
        }

        console.timeEnd("session verifier")
        return { ok: true };
    }
}