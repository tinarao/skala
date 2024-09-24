import { db } from "$lib/db/db";
import { users } from "$lib/db/schema";
import { redis } from "$lib/redis";
import { authMiddleware } from "$lib/server/auth-mw";
import { utapi } from "$lib/server/ut";
import { eq } from "drizzle-orm";

/** @type {import("./$types").RequestHandler} */
export async function PATCH({ request, locals }) {
    const formdata = await request.formData();

    /** @type {File | string} */
    const file = formdata.get("file");
    if (!file) {
        return new Response(JSON.stringify({ "message": "Файл не выбран" }), { status: 400 })
    }

    const response = await utapi.uploadFiles(file);
    if (response.error) {
        return new Response(JSON.stringify({ "message": "Internal server error" }), { status: 500 })
    }

    const saved = await db.update(users).set(
        { picture: response.data?.key }
    ).where(eq(users.id, locals.user.id)).returning()

    return new Response(JSON.stringify({ "message": "ok" }), { status: 201 })
}