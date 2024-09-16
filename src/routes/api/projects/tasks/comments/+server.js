import { db } from '$lib/db/db';
import { authMiddleware } from '$lib/server/auth-mw';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
    const taskId = url.searchParams.get('task');

    const isAuth = await authMiddleware(cookies);
    if (!isAuth) {
        return new Response(JSON.stringify({ "message": "Не авторизован" }), { status: 401 })
    }

    if (!taskId) {
        return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 400 })
    }

    const comments = await db.query.comments.findMany({
        where: (cmt, { eq }) => eq(cmt.taskId, taskId)
    })

    return new Response(JSON.stringify({ "comments": comments }), { status: 200 })
}