import { z } from "zod";

export const registerPayloadModel = z.object({
    username: z.string().min(2),
    email: z.email(),
    password: z.string().min(6)
})