import { db } from "$lib/db/db";
import { projects } from "$lib/db/schema";
import { authMiddleware } from "$lib/server/auth-mw";
import { utapi } from "$lib/server/ut";
import { and, eq } from "drizzle-orm";

/** @type {import("./$types").RequestHandler} */
export async function PATCH({ cookies, request }) {
    const formdata = await request.formData();
    
    const isAuth = await authMiddleware(cookies);
    if (!isAuth) {
        return new Response(JSON.stringify({ "message": "Не авторизован" }), { status: 401 })
    }

    const projectId = formdata.get("projectId");
    if (!projectId) {
        return new Response(JSON.stringify({ "message": "Некорректный запрос" }), { status: 401 }) 
    }


    /** @type {File | string} */
    const file = formdata.get("file");
    if (!file) {
        return new Response(JSON.stringify({ "message": "Файл не выбран" }), { status: 400 })
    }

    const sessionId = cookies.get('session_id');
    const userId = cookies.get('id');

    if (!sessionId || !userId) {
        return new Response(JSON.stringify({"message": "Не авторизован"}), { status: 401 })
    }
    
    const [user, project] = await Promise.all([
        db.query.users.findFirst({
            where: (user, { eq }) => and(
                eq(user.id, parseInt(userId)),
                eq(user.sessionId, sessionId)
            )
        }),
        db.query.projects.findFirst({
            where: (project, { eq }) => eq(project.id, parseInt(projectId.toString()))
        })
    ])
    if (!user || !project) {
        return new Response(JSON.stringify({"message": "Пользователь и/или проект не найдены"}), { status: 404 })
    }

    if (user.id !== project.authorId) {
        return new Response(JSON.stringify({"message": "Нет прав для изменения"}), { status: 403 })
    }

    // TODO: Remove old artwork

    const response = await utapi.uploadFiles(file);
    if (response.error) {
        return new Response(JSON.stringify({ "message": "Internal server error", "error": response.error }), { status: 500 })
    }

    await db.update(projects).set(
        { picture: response.data?.key }
    ).where(eq(projects.id, project.id));

    return new Response(JSON.stringify({ "message": "Сохранено!" }), { status: 200 })
}