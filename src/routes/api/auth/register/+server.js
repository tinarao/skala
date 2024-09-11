import { db } from '$lib/db/db';
import { z } from 'zod';
import bcryptjs from "bcryptjs"
import { users } from '$lib/db/schema';

const RegisterDTO = z.object({
    username: z.string().min(2),
    password: z.string().min(8)
})

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const dto = RegisterDTO.safeParse(await request.json());
    if (!dto.success) {
        return new Response(JSON.stringify(dto.error.message), { status: 400 })
    }

    const duplicate = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.username, dto.data.username),
    });

    if (duplicate) {
        return new Response(JSON.stringify({ "message": "Пользователь с такими данными уже зарегистрирован" }), { status: 400 })
    }

    const salt = bcryptjs.genSaltSync();
    const hash = bcryptjs.hashSync(dto.data.password, salt);

    const doc = {
        password: hash,
        username: dto.data.username
    }
    const created = await db.insert(users).values(doc).onConflictDoNothing().returning();

    return new Response(JSON.stringify({ created }), { status: 200 })
}