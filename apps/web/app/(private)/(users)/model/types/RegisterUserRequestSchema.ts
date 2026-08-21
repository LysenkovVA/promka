import { z } from "zod/v4"

export const RegisterUserRequestSchema = z.object({
  email: z.email(),
  password: z.string(),
})

export type RegisterUserRequest = z.infer<typeof RegisterUserRequestSchema>
