import { db } from "$lib/db/db";
import { users } from "$lib/db/schema";
import { redis } from "$lib/redis";
import { utapi } from "$lib/server/ut";
import { eq } from "drizzle-orm";

/** @type {import("./$types").RequestHandler} */
export async function PATCH({ request, cookies }) {
    const formdata = await request.formData();
    const cookieId = cookies.get("id");
    const cookieSid = cookies.get("session_id");

    if (!cookieId) {
        return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 401 })
    }

    if (!cookieSid) {
        return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 401 })
    }

    const redisUserId = await redis.get(cookieSid);
    if (redisUserId != cookieId) {
        return new Response(JSON.stringify({ "message": "Не авторизован" }), { status: 401 })
    }

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
    ).where(eq(users.id, parseInt(cookieId))).returning()

    return new Response(JSON.stringify({ "message": "ok" }), { status: 201 })
}