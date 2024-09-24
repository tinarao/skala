import { db } from '$lib/db/db';
import { users } from '$lib/db/schema';
import { redis } from '$lib/redis';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies }) {
	const userId = cookies.get('id');

	cookies.delete('id', { path: '/' });
	const sid = cookies.get('session_id');

	if (sid) {
		await redis.del(sid);
	}

	cookies.delete('session_id', { path: '/' });

	await db.update(users).set({ sessionId: null }).where(eq(users.id, parseInt(String(userId))))

	// return new Response('', { status: 200 });
	return redirect(302, "/login")
}
