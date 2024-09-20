import { db } from "$lib/db/db";
import { projectToCollaborators, projectToInvitations, users } from "$lib/db/schema";
import { authMiddleware } from "$lib/server/auth-mw";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const InviteDTO = z.object({
    projectId: z.number().positive(),
    userToInviteUsername: z.string()
})

const AcceptInviteDTO = z.object({
    projectId: z.number().positive(),
    userId: z.number().positive(),
})

/** @type {import("./$types").RequestHandler} */
export async function POST({ request, cookies }) {
    if (!authMiddleware(cookies)) {
        return await fetch("/api/auth/logout", { method: "POST " });
    }

    const { error, success, data } = InviteDTO.safeParse(await request.json());
    if (!success) {
        return new Response(JSON.stringify({ "message": "Некорректный запрос", "error": error.message }), { status: 400 })
    }

    const userId = cookies.get("id")
    if (!userId) {
        // невозможный сценарий БУКВАЛЬНО
        // написано только для того, чтобы линтер успокоился
        return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 400 })
    }

    console.time("Promise all call")
    const [user, project, userToInvite] = await Promise.all([
        db.query.users.findFirst({
            where: (user, { eq }) => eq(user.id, parseInt(userId))
        }),
        db.query.projects.findFirst({
            where: (project, { eq }) => eq(project.id, data.projectId)
        }),
        db.query.users.findFirst({
            where: (user, { eq }) => eq(user.username, data.userToInviteUsername)
        })
    ])
    console.timeEnd("Promise all call")

    if (!user) {
        // Impossible
        return new Response(JSON.stringify({ "message": "Пользователь не найден" }), { status: 404 })
    }

    if (!userToInvite) {
        return new Response(JSON.stringify({ "message": "Пользователь не найден" }), { status: 404 })
    }

    if (!project) {
        return new Response(JSON.stringify({ "message": "Проект не найден" }), { status: 404 })
    }

    if (userToInvite.id === user.id) {
        return new Response(JSON.stringify({ "message": "Вы не можете пригласить в проект себя!" }), { status: 403 })
    }

    await db.insert(projectToInvitations).values({
        userId: userToInvite.id,
        projectId: project.id
    }).onConflictDoNothing();

    return new Response(JSON.stringify({ "message": "Пользователь приглашён!" }), { status: 201 })
}

// Accept invite endpoint
/** @type {import("./$types").RequestHandler} */
export async function PATCH({ request, cookies }) {
    const {error, success, data: dto} = AcceptInviteDTO.safeParse(await request.json());
    if (!success) {
        return new Response(JSON.stringify(error.message), { status: 400 })
    }

    const cookieId = cookies.get('id');
    if (!cookieId || isNaN(parseInt(cookieId)) || parseInt(cookieId) !== dto.userId) {
        return new Response(JSON.stringify({ "message": "Не авторизован"}), { status: 401 })
    }

    if (!authMiddleware(cookies)) {
        return new Response(JSON.stringify({ "message": "Не авторизован"}), { status: 401 })
    }
    
    const txCode = await db.transaction(async (tx) => {
        const invite = await tx.query.projectToInvitations.findFirst({
            where: ( invite, { eq }) => and(
                eq(invite.projectId, dto.projectId),
                eq(invite.userId, dto.userId),
            )
        })
        if (!invite) {
            return 404;
        }

        const deleted = await tx.delete(projectToInvitations).where(and(
            eq(projectToInvitations.projectId, dto.projectId),
            eq(projectToInvitations.userId, dto.userId),
        )).returning();

        const collab = await tx.insert(projectToCollaborators).values({
            userId: dto.userId,
            projectId: dto.projectId
        }).returning();

        if (deleted.length === 0 || collab.length === 0) {
            return 500
        }

        return 200;
        
    });

    switch (txCode) {
        case 404:
            return new Response(JSON.stringify({"message": "Приглашение не найдено"}), { status: 404 });
        case 500:
            return new Response(JSON.stringify({"message": "Внутренняя ошибка сервера"}), { status: 500 });
        case 200:
            return new Response(JSON.stringify({"message": "Ок!"}), { status: 200 })
    }
}

/** @type {import("./$types").RequestHandler} */
export async function GET({ url, cookies }) {
    const projectId = url.searchParams.get("projectId");
    if (!projectId) {
        return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 400 })
    }

    const userId = cookies.get('id');
    if (!userId) {
        // Unreachable
        return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 400 })
    }

    if (!authMiddleware(cookies)) {
        return await fetch("/api/auth/logout", { method: "POST " });
    }

    const project = await db.query.projects.findFirst({
        where: (proj, { eq }) => eq(proj.id, parseInt(projectId)),
    })
    if (!project) {
        return new Response(JSON.stringify({ "message": "Проект не найден" }), { status: 404 })
    }

    const invitations = await db.query.projectToInvitations.findMany({
        where: (inv, { eq }) => eq(inv.projectId, project.id),
    })
    if (!invitations) {
        return new Response(JSON.stringify({ invitations: [] }), { status: 200 })
    }

    let promises = []
    invitations.forEach(inv => {
        const promise = db.query.users.findFirst({
            where: (user, { eq }) => eq(user.id, inv.userId),
            columns: { username: true, picture: true, id: true }
        })
        promises.push(promise)
    })

    const result = await Promise.all(promises)

    return new Response(JSON.stringify({ invitedUsers: result }), { status: 200 })
}