import { z } from 'zod';

export const taskValidator = z.object({
	id: z.number().positive(),
	name: z.string(),
	status: z.string(),
	priority: z.string(),
	description: z.ostring().nullable(),
	projectId: z.number().positive()
});

export const projectValidator = z.object({
	id: z.number().positive(),
	name: z.string(),
	percentage: z.number(),
	authorId: z.number(),
	remind: z.boolean(),
	deadline: z.coerce.date({ message: 'Некорректная дата' }),
	createdAt: z.coerce.date({ message: 'Некорректная дата' }),
	description: z.ostring().nullable()
})