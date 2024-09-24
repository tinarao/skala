import { db } from '$lib/db/db';
import { projects } from '$lib/db/schema';
import { authMiddleware } from '$lib/server/auth-mw';
import { and, eq, count } from 'drizzle-orm';

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ cookies, url, params }) {
    const projectId = params.id;
    if (!projectId || isNaN(parseInt(projectId))) {
        return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 400 })
    }

    const isAllowed = await authMiddleware(cookies);
    if (!isAllowed) {
        return new Response(JSON.stringify({ "message": "Не авторизован" }), { status: 401 })
    }

    const cookieId = cookies.get('id');
    const cookieSid = cookies.get('session_id');
    if (!cookieId || !cookieSid) {
        return new Response(JSON.stringify({ "message": "Не авторизован" }), { status: 401 })
    }

    const [user, project] = await Promise.all([
        db.query.users.findFirst({
            where: (user, { eq }) => and(
                eq(user.id, parseInt(cookieId)),
                eq(user.sessionId, cookieSid)
            )
        }),
        db.query.projects.findFirst({
            where: (project, { eq }) => and(
                eq(project.id, parseInt(projectId))
            )
        })
    ])

    if (!user || !project) {
        return new Response(JSON.stringify({ "message": "Проект не найден" }), { status: 404 })
    }

    if (project.authorId !== user.id) {
        return new Response(JSON.stringify({ "message": "Запрещено" }), { status: 403 })
    }

    const deleted = await db.delete(projects).where(eq(projects.id, project.id)).returning();
    if (!deleted[0].id) {
        return new Response(JSON.stringify({ "message": "Ошибка при удалении проекта" }), { status: 500 })
    }

    // if (deleted[0].picture) {
    //     picture.delete()
    // }

    return new Response(JSON.stringify({ "message": "Удалено!" }), { status: 200 })

}
