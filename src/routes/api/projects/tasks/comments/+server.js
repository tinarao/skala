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
export async function GET({ url, locals }) {
    const taskId = url.searchParams.get('task');

    // get user
    // get project
    // check if user can watch this info

    if (!taskId) {
        return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 400 })
    }

    const task = await db.query.tasks.findFirst({
        where: (task, { eq }) => eq(task.id, parseInt(taskId)),
        with: { project: { with: { collaborations: { with: { user: { columns: { id: true } } } } } } }
    })
    if (!task) {
        return new Response(JSON.stringify({ "message": "Задача не найдена" }), { status: 404 })
    }

    let isCollaborator = false;
    if (task.project?.authorId !== locals.user.id) {
        // so if not author
        return new Response(JSON.stringify({ "message": "Доступ ограничен" }), { status: 403 })
    }

    task.project?.collaborations.forEach(c => {
        if (c.user.id === locals.user.id) {
            isCollaborator = true;
        }
    })

    if (!isCollaborator) {
        // and not colalborator
        return new Response(JSON.stringify({ "message": "Доступ ограничен" }), { status: 403 })
    }

    const comments = await db.query.comments.findMany({
        where: (cmt, { eq }) => eq(cmt.taskId, parseInt(taskId))
    })

    return new Response(JSON.stringify({ "comments": comments }), { status: 200 })
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ locals, request }) {
    const { data: dto, success, error } = AddCommentDTO.safeParse(await request.json())
    if (!success) {
        return new Response(JSON.stringify({ "message": "Некорректный запрос", "errors": error.message }), { status: 400 })
    }

    const task = await db.query.tasks.findFirst({
        where: (task, { eq }) => and(
            eq(task.id, dto.taskId),
            eq(task.projectId, dto.projectId)
        )
    })
    if (!task) {
        return new Response(JSON.stringify({ "message": "Задача не найдена" }), { status: 404 })
    }

    // check if CREATOR or COLLABORATOR
    const [project, collabs] = await Promise.all([
        db.query.projects.findFirst({
            where: (project, { eq }) => eq(project.id, dto.projectId)
        }),
        db.query.projectToCollaborators.findFirst({
            where: (collab, { eq }) => and(
                eq(collab.projectId, dto.projectId),
                eq(collab.userId, locals.user.id)
            )
        })
    ])
    if (!project && !collabs) {
        return new Response(JSON.stringify({ "message": "Задача и/или проект не найдены" }), { status: 404 })
    }



    if (task.projectId !== project?.id) {
        return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 400 })
    }

    if ((project?.authorId !== locals.user.id) && collabs?.userId !== locals.user.id) {
        return new Response(JSON.stringify({ "message": "Запрещено" }), { status: 403 })
    }

    const created = await db
        .insert(comments)
        .values({ body: dto.comment, authorId: locals.user.id, taskId: task.id })
        .returning();

    return new Response(JSON.stringify(created), { status: 200 })

}