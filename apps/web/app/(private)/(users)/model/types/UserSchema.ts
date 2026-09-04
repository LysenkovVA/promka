import { z } from "zod/v4"
import {
  ZOD_INVALID_BOOLEAN_TYPE,
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
  ZOD_VALUE_REQUIRED,
} from "@/lib/zod/commonErrors"
import { TeamMemberSchema } from "@/TeamMember/model/types/TeamMemberSchema"
import { stripTimezone } from "@/lib/date/utils"

/**
 * Схема валидации UserEntity
 */
export const UserSchema = z.object(
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
    phoneNumber: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .nullish(),
    emailConfirmed: z.boolean({
      error: (issue) => {
        switch (issue.code) {
          case "invalid_type":
            return ZOD_INVALID_BOOLEAN_TYPE
        }
      },
    }),
    phoneNumberConfirmed: z.boolean({
      error: (issue) => {
        switch (issue.code) {
          case "invalid_type":
            return ZOD_INVALID_BOOLEAN_TYPE
        }
      },
    }),
    surname: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .nullish(),
    name: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .nullish(),
    // birthDate: z.iso
    //   .datetime({
    //     offset: true,
    //     error: (issue) =>
    //       issue.input === undefined
    //         ? ZOD_VALUE_REQUIRED
    //         : ZOD_INVALID_DATETIME_TYPE,
    //   })
    //   .nullish(),
    birthDate: z.coerce.date()
      .transform((val) => stripTimezone(val))
      .nullish(),
    teamMembers: z
      .array(
        // Для устранения ошибок с циклическими зависимостями
        z
          .lazy<typeof TeamMemberSchema>(() => {
            const { TeamMemberSchema } = require("@/TeamMember")
            return TeamMemberSchema
          })
          .optional(),
        {
          error: (issue) => {
            switch (issue.code) {
              case "invalid_type":
                return ZOD_INVALID_OBJECT_TYPE
            }
          },
        }
      )
      .nullish(),
    // TODO avatar
    // avatar:
    //   // Для устранения ошибок с циклическими зависимостями
    //   z
    //     .lazy(() => {
    //       const { FileEntitySchema } = require("@/Files")
    //       return FileEntitySchema
    //     })
    //     .nullish(),
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined ? ZOD_VALUE_REQUIRED : ZOD_INVALID_OBJECT_TYPE,
  }
)

export type User = z.infer<typeof UserSchema>
