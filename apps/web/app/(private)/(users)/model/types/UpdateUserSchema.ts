import { z } from "zod/v4"
import { UserSchema } from "./UserSchema"

export const UpdateUserSchema = UserSchema.partial()

export type UpdateUser = z.infer<typeof UpdateUserSchema>
