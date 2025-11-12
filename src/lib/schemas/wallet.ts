import z from "zod";

export const GetStubsSuccessResponseSchema = z.object({
    success: z.literal(true),
    message: z.string(),
    data: z.number()
})

export const GetStubsFailureResponseSchema = z.object({
    success: z.literal(false),
    message: z.string()
})

export const GetStubsResponseSchema = z.discriminatedUnion('success', [
    GetStubsFailureResponseSchema,
    GetStubsSuccessResponseSchema
])

export type GetStubsSuccessResponse = z.infer<typeof GetStubsSuccessResponseSchema>
export type GetStubsFailureResponse = z.infer<typeof GetStubsFailureResponseSchema>

export type GetStubsResponse = z.infer<typeof GetStubsResponseSchema>