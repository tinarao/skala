import { db } from '$lib/db/db';
import { redirect } from '@sveltejs/kit';

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

	const project = await db.query.projects.findFirst({
		where: (pr, { eq }) => eq(pr.id, parseInt(projectId)),
		with: { tasks: true }
	});

	if (!project || project.authorId !== parseInt(userId)) {
		redirect(302, '/app');
	}

	return { project };
}
