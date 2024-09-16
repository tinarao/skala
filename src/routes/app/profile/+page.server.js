import { db } from "$lib/db/db"
import { utapi } from "$lib/server/ut";

/** @type {import("./$types").PageServerLoad} */
export async function load({ cookies, url }) {
    const cookieID = cookies.get('id')
    const userDoc = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, cookieID)
    })
    if (!userDoc) {
        return redirect(302, "/app");
    }

    const { sessionId, password, ...user } = userDoc;

    if (!!user.picture) {
        const url = await utapi.getSignedURL(user.picture, {
            expiresIn: '7 days',
        });

        user.picture = url.url
    }

    return { user }
}