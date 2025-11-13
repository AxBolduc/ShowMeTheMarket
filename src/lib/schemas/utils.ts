import z from 'zod';

export const FailureResponseSchema = z.object({
	success: z.literal(false),
	message: z.string()
});
