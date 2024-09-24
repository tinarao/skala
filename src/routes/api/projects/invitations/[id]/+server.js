import { db } from "$lib/db/db";
import { projectToInvitations } from "$lib/db/schema";
import { and, eq } from "drizzle-orm";

/** @type {import("./$types").RequestHandler} */
export async function DELETE({ cookies, params, locals }) {
    const projectId = params.id;

    if (isNaN(parseInt(projectId))) {
        return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 400 })
    }

    await db
        .delete(projectToInvitations)
        .where(and(
            eq(projectToInvitations.userId, locals.user.id),
            eq(projectToInvitations.projectId, parseInt(projectId))
        ))

    return new Response(JSON.stringify({ "message": "Удалено!" }), { status: 200 })
}