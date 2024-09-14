import { z } from 'zod';
import { db } from '$lib/db/db';
import { tasks } from '$lib/db/schema';

const createTaskDTO = z.object({
    projectId: z.number().positive(),
    name: z.string(),
})

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const data = await request.json();

    const taskDto = createTaskDTO.safeParse(data);
    if (!taskDto.success) {
        return new Response(JSON.stringify({
            "message": "Некорректный запрос",
            "errors": taskDto.error.message
        }), { status: 400 })
    }

    const saved = await db.insert(tasks).values({
        name: taskDto.data.name,
        projectId: taskDto.data.projectId
    }).returning();

    return new Response(JSON.stringify(saved), { status: 200 })
}