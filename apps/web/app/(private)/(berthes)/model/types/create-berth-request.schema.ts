import { z } from "zod/v4"
import { BerthSchema } from "./berth.schema"

export const CreateBerthRequestSchema = BerthSchema.omit({
  id: true,
})

export type CreateBerthRequest = z.infer<typeof CreateBerthRequestSchema>
