import z from "zod";

export const GetStubsResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.number()
})

export type GetStubsResponse = z.infer<typeof GetStubsResponseSchema>