import { db } from "$lib/db/db";
import { projectToInvitations } from "$lib/db/schema";
import { authMiddleware } from "$lib/server/auth-mw";
import { and, eq } from "drizzle-orm";

/** @type {import("./$types").RequestHandler} */
export async function DELETE({ cookies, params, url }) {
    const projectId = params.id;
    const userId = url.searchParams.get('user');

    const cookieId = cookies.get('id');
    if (!cookieId) {
        return new Response(JSON.stringify({ "message": "Не авторизован" }), { status: 401 })
    }

    if (!userId) {
        return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 400 })
    }
    if (isNaN(parseInt(userId))) {
        return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 400 })
    }

    if (parseInt(cookieId) !== parseInt(userId)) {
        return new Response(JSON.stringify({ "message": "Не авторизован" }), { status: 401 })
    }

    if (isNaN(parseInt(projectId))) {
        return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 400 })
    }

    if (!authMiddleware(cookies)) {
        return new Response(JSON.stringify({ "message": "Не авторизован" }), { status: 401 })
    }

    const invite = await db.query.projectToInvitations.findFirst({
        where: (invite, { eq }) => and(
            eq(invite.projectId, parseInt(projectId)),
            eq(invite.userId, parseInt(userId))
        )
    })
    if (!invite) {
        return new Response(JSON.stringify({ "message": "Приглашение не найдено" }), { status: 404 })
    }

    const deleted = await db
        .delete(projectToInvitations)
        .where(and(
            eq(projectToInvitations.userId, parseInt(userId)),
            eq(projectToInvitations.projectId, parseInt(projectId))))

    return new Response(JSON.stringify({ "message": "Удалено!" }), { status: 200 })
}