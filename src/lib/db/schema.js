import { relations } from 'drizzle-orm';
import {
	boolean,
	date,
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	varchar
} from 'drizzle-orm/pg-core';

export const plansEnum = pgEnum('plans', ['free', 'pro']);
export const roleEnum = pgEnum('role', ['programmer', 'designer', 'manager']);

export const users = pgTable('user', {
	id: serial('id').primaryKey(),
	username: text('username').notNull().unique().notNull(),
	email: varchar('email', { length: 256 }).unique(),
	password: varchar('password', { length: 128 }).notNull(),
	plan: plansEnum('plans'),
	picture: text('picture'),
	sessionId: text('sessionId'),
	role: roleEnum('role')
});

export const usersRelations = relations(users, ({ many }) => ({
	projects: many(projects)
}));

export const projects = pgTable('project', {
	id: serial('id').primaryKey(),
	name: text('name'),
	percentage: integer('precentage').default(0),
	authorId: integer('projectId').references(() => users.id),
	remind: boolean('remind'),
	deadline: date('deadline'),
	createdAt: date('createdAt')
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
	author: one(users, {
		fields: [projects.authorId],
		references: [users.id]
	}),
	tasks: many(tasks)
}));

// Tasks

export const taskStatusEnum = pgEnum('status', ['not_started', 'in_progress', 'done', 'scrapped']);
export const PrioritiesEnum = ['low', 'normal', 'high', 'ultra'];
export const taskPriorityEnum = pgEnum('priority', ['low', 'normal', 'high', 'ultra']);

export const tasks = pgTable('task', {
	id: serial('id').primaryKey(),
	name: text('name'),
	status: taskStatusEnum('status').default('not_started'),
	priority: taskPriorityEnum('priority').default('normal'),
	description: text('description'),
	projectId: integer('projectId').references(() => projects.id)
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
	project: one(projects, {
		fields: [tasks.projectId],
		references: [projects.id]
	}),
	comments: many(comments)
}));

export const comments = pgTable('comment', {
	id: serial('id').primaryKey(),
	authorId: integer('authorId').references(() => users.id),
	taskId: integer('taskId').references(() => tasks.id),
	body: text('body').notNull(),
	createdAt: date('createdAt'),
	likes: integer('likes').default(0)
})

export const commentRelations = relations(comments, ({ one }) => ({
	task: one(tasks, {
		fields: [comments.taskId],
		references: [tasks.id]
	}),
	author: one(users, {
		fields: [comments.authorId],
		references: [users.id]
	}),
}))