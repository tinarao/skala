import { db } from "$lib/db/db"
import { utapi } from "$lib/server/ut";
import { redirect } from "@sveltejs/kit";

/** @type {import("./$types").PageServerLoad} */
export async function load({ cookies, url }) {
    const cookieID = cookies.get('id')
    if (!cookieID) {
        return redirect(302, "/login")
    }

    const userDoc = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, parseInt(cookieID))
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