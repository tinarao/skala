import { DB_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
	projects,
	tasks,
	users,
	comments,
	projectsRelations,
	tasksRelations,
	usersRelations,
	commentRelations,
} from './schema';

const client = postgres(DB_URL);
export const db = drizzle(client, {
	schema: {
		users: users,
		projects: projects,
		tasks: tasks,
		comments: comments,

		usersRelation: usersRelations,
		projectsRelations: projectsRelations,
		tasksRelations: tasksRelations,
		commentsRelations: commentRelations
	}
});
