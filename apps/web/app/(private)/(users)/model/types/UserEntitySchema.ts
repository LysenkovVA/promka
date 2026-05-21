import { z, ZodType } from "zod/v4"

import { IUserEntity } from "./IUserEntity"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
  ZOD_VALUE_REQUIRED,
} from "@/lib/zod/commonErrors"

/**
 * Схема валидации UserEntity
 */
export const UserEntitySchema: ZodType<IUserEntity> = z.object(
  {
    id: z
      .cuid2({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
            case "invalid_format":
              return ZOD_INVALID_CUID_FORMAT(issue.input)
          }
        },
      })
      .nullish(),
    email: z.string({
      error: (issue) => {
        switch (issue.code) {
          case "invalid_type":
            return ZOD_INVALID_STRING_TYPE
        }
      },
    }),
    hashedPassword: z.string({
      error: (issue) => {
        switch (issue.code) {
          case "invalid_type":
            return ZOD_INVALID_STRING_TYPE
        }
      },
    }),
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined ? ZOD_VALUE_REQUIRED : ZOD_INVALID_OBJECT_TYPE,
  }
)
