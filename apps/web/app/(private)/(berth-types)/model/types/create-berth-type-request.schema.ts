import { z } from "zod/v4"
import { BerthTypeSchema } from "./berth-type.schema"

export const CreateBerthTypeRequestSchema = BerthTypeSchema.omit({
  id: true,
})

export type CreateBerthTypeRequest = z.infer<
  typeof CreateBerthTypeRequestSchema
>
