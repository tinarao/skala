import { db } from '$lib/db/db';
import { redis } from '$lib/redis';
import { utapi } from '$lib/server/ut';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
	try {
		const cookieId = cookies.get('id');
		const cookieSid = cookies.get('session_id');

		if (!cookieId) {
			throw new Error()
		}

		if (isNaN(parseInt(cookieId))) {
			throw new Error()
		}

		if (!cookieSid) {
			throw new Error()
		}

		const userDoc = await db.query.users.findFirst({
			where: (user, { eq }) => eq(user.id, parseInt(cookieId))
		})
		if (!userDoc) {
			throw new Error()
		}

		// check session
		const sessionUserId = await redis.get(cookieSid);
		if (sessionUserId !== userDoc.id) {
			throw new Error()
		}

		if (!!userDoc.picture) {
			const url = await utapi.getSignedURL(userDoc.picture, {
				expiresIn: '7 days',
			});

			userDoc.picture = url.url
		}

		const { sessionId, password, ...user } = userDoc;

		return { user: user }
	} catch (error) {
		cookies.delete('session_id', { path: '/' });
		cookies.delete('id', { path: '/' })

		redirect(302, "/login")
	}
}
