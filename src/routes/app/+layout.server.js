import { db } from '$lib/db/db';
import { utapi } from '$lib/server/ut';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
	const user = locals.user;

	const [projects, collabs, invites] = await Promise.all([
		db.query.projects.findMany({
			where: (project, { eq }) => eq(project.authorId, user.id)
		}),
		db.query.projectToCollaborators.findMany({
			where: (collab, { eq }) => eq(collab.userId, user.id),
			with: { project: true }
		}),
		db.query.projectToInvitations.findMany({
			where: (invite, { eq }) => eq(invite.userId, user.id),
			with: { project: true }
		})
	])

	for (let project of projects) {
		if (project.picture) {
			const url = await utapi.getSignedURL(project.picture, {
				expiresIn: '7 days',
			});

			project.picture = url.url
		}
	}

	return {
		user,
		collabs,
		invites,
		projects
	}
}