import { db } from '$lib/db/db';
import { authMiddleware } from '$lib/server/auth-mw';
import { redirect } from '@sveltejs/kit';

// get project
// get invites

/** 
 * @param {number} projectId
*/
async function getInvites(projectId) {
	const project = await db.query.projects.findFirst({
		where: (proj, { eq }) => eq(proj.id, projectId),
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

	return await Promise.all(promises)
}

/** 
 * @param {number} projectId
 * @param {number} userId
*/
async function getProjectDetails(projectId, userId) {
	const project = await db.query.projects.findFirst({
		where: (pr, { eq }) => eq(pr.id, projectId),
		with: {
			tasks: {
				with: { comments: true }
			}
		}
	});

	if (!project || project.authorId !== userId) {
		redirect(302, '/app');
	}

	return project;
}

/** @type { import("./$types").PageServerLoad } */
export async function load({ url, depends }) {
	depends('tasks:fetch');
	const projectId = url.searchParams.get('id');
	const userId = url.searchParams.get('u');

	if (!projectId) {
		return redirect(302, '/login');
	}

	if (!userId) {
		return redirect(302, '/login');
	}

	const [project, invites] = await Promise.all([
		getProjectDetails(parseInt(projectId), parseInt(userId)),
		getInvites(parseInt(projectId))
	])

	return { project, invites }
}