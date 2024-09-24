import { db } from '$lib/db/db';
import { comments } from '$lib/db/schema';
import { authMiddleware } from '$lib/server/auth-mw';
import { and } from 'drizzle-orm';
import { z } from 'zod';

const AddCommentDTO = z.object({
    comment: z.string().max(120, "Слишком длинный комментарий"),
    taskId: z.number(),
    projectId: z.number()
})

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
    const taskId = url.searchParams.get('task');

    // get user
    // get project
    // check if user can watch this info

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

/** @type {import('./$types').RequestHandler} */
export async function POST({ url, cookies, request }) {
    try {
        const isAuth = await authMiddleware(cookies);
        if (!isAuth) {
            return new Response(JSON.stringify({ "message": "Не авторизован" }), { status: 401 })
        }

        const userId = cookies.get('id');
        if (!userId) {
            return new Response(JSON.stringify({ "message": "Не авторизован" }), { status: 401 })
        }

        const { data: dto, success } = AddCommentDTO.safeParse(await request.json())
        if (!success) {
            return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 400 })
        }

        const [user, project, task] = await Promise.all([
            db.query.users.findFirst({
                where: (user, { eq }) => eq(user.id, parseInt(userId))
            }),
            db.query.projects.findFirst({
                where: (project, { eq }) => eq(project.id, dto.projectId)
            }),
            db.query.tasks.findFirst({
                where: (task, { eq }) => eq(task.id, dto.taskId)
            })
        ])

        if (!task || !project || !user) {
            return new Response(JSON.stringify({
                "message": "Не удалось найти необходимые данные",
                "description": "Проверьте правильность введённых данных и попробуйте снова"
            }), { status: 400 })
        }
        if (project.id !== task.projectId) {
            return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 400 })
        }

        // Check if collaborator also
        const collabs = await db.query.projectToCollaborators.findFirst({
            where: (collab, { eq }) => and(
                eq(collab.projectId, dto.projectId),
                eq(collab.userId, parseInt(userId)),
            )
        })

        // if user is not collaborator and if user is not author
        if (!collabs && user.id !== project.authorId) {
            return new Response(JSON.stringify({ "message": "Запрещено" }), { status: 403 })
        }

        // Create comment
        const created = await db.insert(comments).values({
            authorId: user.id,
            taskId: task.id,
            body: dto.comment,
            likes: 0
        }).onConflictDoNothing().returning()

        return new Response(JSON.stringify({ "message": "Создано", id: created[0].id }), { status: 201 })

    } catch (error) {
        return new Response(JSON.stringify({ "message": "Внутренняя ошибка сервера" }), { status: 500 })
    }

}