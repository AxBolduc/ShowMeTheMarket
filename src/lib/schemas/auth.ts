import z from "zod";

export const TheShowAuthResponseSchema = z.object({
    account_token: z.string(),
    expiration: z.string(),
    account_id: z.number(),
    username: z.string(),
    age_group: z.number(),
    ts_token: z.string(),
})

export type TheShowAuthResponse = z.infer<typeof TheShowAuthResponseSchema>