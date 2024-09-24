import { db } from '$lib/db/db';
import { projects, tasks } from '$lib/db/schema';
import { utapi } from '$lib/server/ut';
import { redirect } from '@sveltejs/kit';
import { and, count, eq } from 'drizzle-orm';

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
		// HAIIIYYYYAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHH
		// ☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨☨
		with: {
			tasks: {
				with: {
					comments: {
						with: {
							author: {
								columns: {
									id: true, picture: true, username: true
								}
							}
						}
					}
				}
			}
		}
	});

	if (!project) {
		redirect(302, '/app');
	}

	if (project.authorId !== userId) {
		const collaborators = await db.query.projectToCollaborators.findFirst({
			where: (clb, { eq }) => and(
				eq(clb.projectId, projectId),
				eq(clb.userId, userId)
			)
		});
		if (!collaborators) {
			return redirect(302, "/app")
		}
	}

	return project;
}

/** 
 * @param {number} projectId
*/
async function getPercentage(projectId) {
	const [tasksDoneCount, project] = await Promise.all([
		db
			.select({ count: count() })
			.from(tasks)
			.where(and(
				eq(tasks.projectId, projectId),
				eq(tasks.status, "done")
			)),
		db.query.projects.findFirst({
			where: (project, { eq }) => eq(project.id, projectId),
			with: { tasks: true }
		})
	])

	if (!project) {
		return redirect(302, '/app');
	}

	const percentage = parseFloat(
		(tasksDoneCount[0].count / project?.tasks.length * 100).toFixed(2)
	);
	await db
		.update(projects)
		.set({ percentage })
		.where(eq(projects.id, projectId))

	return percentage
}


/** @type { import("./$types").PageServerLoad } */
export async function load({ url, depends, locals }) {
	depends('tasks:fetch');
	const projectId = url.searchParams.get('id');
	const user = locals.user;

	if (!projectId) {
		return redirect(302, '/app');
	}

	const [project, invites, percentage] = await Promise.all([
		getProjectDetails(parseInt(projectId), user.id),
		getInvites(parseInt(projectId)),
		getPercentage(parseInt(projectId))
	])

	return { project, invites, percentage }
}