import { z } from "zod/v4"
import { BerthTypeSchema } from "./berth-type.schema"

export const UpdateBerthTypeResponseSchema = BerthTypeSchema.partial()

export type UpdateBerthTypeResponse = z.infer<
  typeof UpdateBerthTypeResponseSchema
>
