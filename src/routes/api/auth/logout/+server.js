import { redis } from '$lib/redis';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies }) {
	cookies.delete('id', { path: '/' });
	const sid = cookies.get('session_id');

	if (sid) {
		await redis.del(sid);
	}

	cookies.delete('session_id', { path: '/' });

	// return new Response('', { status: 200 });
	return redirect(302, "/login")
}
