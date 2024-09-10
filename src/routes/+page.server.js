import { db } from '$lib/db/db';
import { users } from '$lib/db/schema';

export async function load() {
    const allUsers = await db.select().from(users);
    return { allUsers }
}