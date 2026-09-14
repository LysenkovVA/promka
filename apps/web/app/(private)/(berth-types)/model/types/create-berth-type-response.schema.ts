import { z } from "zod/v4"
import { BerthTypeSchema } from "./berth-type.schema"

export const CreateBerthTypeResponseSchema = BerthTypeSchema.extend({})

export type CreateBerthTypeResponse = z.infer<
  typeof CreateBerthTypeResponseSchema
>
