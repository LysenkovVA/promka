import { z } from "zod/v4"
import { BerthSchema } from "./berth.schema"

export const UpdateBerthRequestSchema = BerthSchema.partial()

export type UpdateBerthRequest = z.infer<typeof UpdateBerthRequestSchema>
