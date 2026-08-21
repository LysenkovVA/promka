import { z, ZodType } from "zod/v4"
import {
  ZOD_INVALID_EMAIL_FORMAT,
  ZOD_INVALID_STRING_TYPE,
  ZOD_VALUE_REQUIRED,
} from "@/lib/zod/commonErrors"
import { ILoginSchema } from "./ILoginSchema"

export const LoginSchema: ZodType<ILoginSchema> = z.object({
  email: z.email({
    error: (issue) => {
      switch (issue.code) {
        case "invalid_format":
          return ZOD_INVALID_EMAIL_FORMAT
        case "invalid_type":
          return ZOD_INVALID_STRING_TYPE
      }
    },
    // issue.input === undefined ? ZOD_VALUE_REQUIRED : ZOD_INVALID_STRING_TYPE,
  }),
  password: z.string({
    error: (issue) =>
      issue.input === undefined ? ZOD_VALUE_REQUIRED : ZOD_INVALID_STRING_TYPE,
  }),
})
