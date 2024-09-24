import { db } from "$lib/db/db"
import { utapi } from "$lib/server/ut";
import { redirect } from "@sveltejs/kit";

/** @type {import("./$types").PageServerLoad} */
export async function load({ cookies, url, locals }) {
    const { id: userId } = locals.user
    const user = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, userId),
        columns: { password: false, sessionId: false }
    })
    if (!user) {
        return redirect(302, "/app");
    }

    if (user.picture) {
        const url = await utapi.getSignedURL(user.picture, {
            expiresIn: '7 days',
        });

        user.picture = url.url
    }

    return { user }
}