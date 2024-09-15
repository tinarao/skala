import { z } from 'zod';

export const taskValidator = z.object({
	id: z.number().positive(),
	name: z.string(),
	status: z.string(),
	priority: z.string(),
	description: z.ostring().nullable(),
	projectId: z.number().positive()
});
