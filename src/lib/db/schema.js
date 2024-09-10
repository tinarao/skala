import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const plansEnum = pgEnum('plans', ["free", "pro"])

export const users = pgTable('user', {
    id: serial('id').primaryKey(),
    username: text('username').notNull().unique(),
    email: varchar('email', { length: 256 }).unique(),
    password: varchar('password', { length: 48 }),
    plan: plansEnum('plans'),
    picture: text('picture')
})

export const usersRelations = relations(users, ({ many }) => ({
    projects: many(projects),
}));

export const projects = pgTable('project', {
    id: serial('id').primaryKey(),
    name: text('name'),
    percentage: integer('precentage'),
    authorId: integer('projectId').references(() => users.id)
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
    author: one(users, {
        fields: [projects.authorId],
        references: [users.id],
    }),
    tasks: many(tasks)
}));


// Tasks

export const taskStatusEnum = pgEnum('status', ['not_started', 'in_progress', 'done', 'scrapped'])
export const taskPriorityEnum = pgEnum('priority', ['low', 'normal', 'high', 'ultra'])

export const tasks = pgTable('task', {
    id: serial('id').primaryKey(),
    name: text('name'),
    status: taskStatusEnum('status'),
    priority: taskPriorityEnum('taskPriorityEnum'),
    description: text('description'),
    projectId: integer('projectId').references(() => projects.id)
})