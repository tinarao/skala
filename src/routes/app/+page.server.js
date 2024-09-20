import { goto } from '$app/navigation';
import * as db from '$lib/db/db';
import { redirect } from '@sveltejs/kit';

/** @type {import("./$types").PageServerLoad} */
export async function load({ cookies }) {
	const userId = cookies.get('id');
	if (!userId) {
		// TODO
		return;
	}

	const [userDoc, collabs] = await Promise.all([
		db.db.query.users.findFirst({
			where: (user, { eq }) => eq(user.id, parseInt(userId)),
			with: {
				projects: true,
			}
		}),
		db.db.query.projectToInvitations.findMany({
			where: ( collab, { eq }) => eq(collab.userId, parseInt(userId)),
			with: { project: true }
		})
	])

	if (!userDoc) {
		redirect(302, '/login');
		return;
	}

	if (userDoc.projects.length === 0) {
		redirect(302, '/app/create');
		return;
	}

	return { projects: userDoc.projects, collabs: collabs };
}
