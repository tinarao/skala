import { db } from '$lib/db/db';
import { redis } from '$lib/redis';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
	console.time('session verifier');
	const sessionId = cookies.get('session_id');
	const cookieId = cookies.get('id');
	if (!sessionId) {
		console.timeEnd('session verifier');
		return redirect(302, '/login');
	}

	if (!cookieId) {
		const userId = await redis.get(sessionId);
		if (!userId || userId !== cookieId) {
			cookies.delete('session_id', { path: '/' });
			cookies.delete('id', { path: '/' });

			console.timeEnd('session verifier');
			return redirect(302, '/login');
		}

		const user = await db.query.users.findFirst({
			where: (user, { eq }) => eq(user.sessionId, sessionId)
		});

		if (!user) {
			console.timeEnd('session verifier');
			return redirect(302, '/login');
		}

		cookies.set('session_id', String(user.sessionId), { path: '/' });
		const redisResult = await redis.set(sessionId, user.id, { ex: 60 * 60 * 24 });
		if (redisResult !== 'OK') {
			return new Response(
				JSON.stringify({ message: 'Ошибка при авторизации. Попробуйте позже.' }),
				{ status: 500 }
			);
		}

		return { ok: true, user: { id: user.id, username: user.username } };
	} else {
		const userId = await redis.get(sessionId);
		if (!userId || userId !== parseInt(cookieId)) {
			cookies.delete('session_id', { path: '/' });
			cookies.delete('id', { path: '/' });

			console.timeEnd('session verifier');
			return redirect(302, '/login');
		}

		const user = await db.query.users.findFirst({
			where: (user, { eq }) => eq(user.id, parseInt(userId))
		});

		if (!user) {
			cookies.delete('session_id', { path: '/' });
			cookies.delete('id', { path: '/' });

			console.timeEnd('session verifier');
			return redirect(302, '/login');
		}

		if (!user.sessionId) {
			cookies.delete('session_id', { path: '/' });
			cookies.delete('id', { path: '/' });

			console.timeEnd('session verifier');
			return redirect(302, '/login');
		}

		cookies.set('id', user.id.toString(), { path: '/' });
		cookies.set('session_id', user?.sessionId, { path: '/' });

		console.timeEnd('session verifier');
		return { ok: true, user: { id: user.id, username: user.username } };
	}
}
