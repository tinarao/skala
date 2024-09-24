import { db } from '$lib/db/db';
import { projects } from '$lib/db/schema';
import { authMiddleware } from '$lib/server/auth-mw';
import { and, eq, count } from 'drizzle-orm';

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ cookies, url, params, locals }) {
    const projectId = params.id;
    if (!projectId || isNaN(parseInt(projectId))) {
        return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 400 })
    }

    const [user, project] = await Promise.all([
        db.query.users.findFirst({
            where: (user, { eq }) => and(
                eq(user.id, locals.user.id)
            )
        }),
        db.query.projects.findFirst({
            where: (project, { eq }) => and(
                eq(project.id, parseInt(projectId)),
                eq(project.authorId, locals.user.id)
            )
        })
    ])

    if (!user || !project) {
        return new Response(JSON.stringify({ "message": "Проект не найден" }), { status: 404 })
    }

    const deleted = await db.delete(projects).where(eq(projects.id, project.id)).returning();
    if (!deleted[0].id) {
        return new Response(JSON.stringify({ "message": "Ошибка при удалении проекта" }), { status: 500 })
    }

    return new Response(JSON.stringify({ "message": "Удалено!" }), { status: 200 })

}
