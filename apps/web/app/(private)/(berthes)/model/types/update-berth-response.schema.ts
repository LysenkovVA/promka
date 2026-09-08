import { z } from "zod/v4"
import { BerthSchema } from "./berth.schema"

export const UpdateBerthResponseSchema = BerthSchema.partial()

export type UpdateBerthResponse = z.infer<typeof UpdateBerthResponseSchema>
