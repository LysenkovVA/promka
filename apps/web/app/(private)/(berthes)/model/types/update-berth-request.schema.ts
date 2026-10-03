import { z } from "zod/v4"
import { BerthSchema } from "./berth.schema"

export const UpdateBerthRequestSchema = BerthSchema.partial({ name: true })

export type UpdateBerthRequest = z.infer<typeof UpdateBerthRequestSchema>
