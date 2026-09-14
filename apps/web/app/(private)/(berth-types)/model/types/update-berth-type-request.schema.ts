import { z } from "zod/v4"
import { BerthTypeSchema } from "./berth-type.schema"

export const UpdateBerthTypeRequestSchema = BerthTypeSchema.partial()

export type UpdateBerthTypeRequest = z.infer<
  typeof UpdateBerthTypeRequestSchema
>
