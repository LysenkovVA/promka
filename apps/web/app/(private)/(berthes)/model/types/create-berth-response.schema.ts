import { z } from "zod/v4"
import { BerthSchema } from "./berth.schema"

export const CreateBerthResponseSchema = BerthSchema.extend({})

export type CreateBerthResponse = z.infer<typeof CreateBerthResponseSchema>
