import { z } from "zod/v4"
import { UserSchema } from "@/Users"

export const RegisterUserResponseSchema = UserSchema.omit({
  hashedPassword: true,
})

export type RegisterUserResponse = z.infer<typeof RegisterUserResponseSchema>
