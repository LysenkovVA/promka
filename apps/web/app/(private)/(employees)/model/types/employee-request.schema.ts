import { z } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_DATETIME_TYPE,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
} from "@/lib/zod/commonErrors"
import { stripTimezone } from "@/lib/date/utils"
import { isValidPhoneNumber } from "react-phone-number-input/input"
import { SnilsHelper } from "@/Snilses"

/**
 * Схема валидации EmployeeRequestSchema
 */
export const EmployeeRequestSchema = z.object(
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
    surname: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .min(1, { error: "Фамилия не указана" }),
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
    patronymic: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .nullish(),
    birthDate: z.coerce
      .date({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_DATETIME_TYPE
          }
        },
      })
      .transform((val) => stripTimezone(val))
      .nullish(),
    citizenship: z
      .object(
        {
          id: z.cuid2({
            error: (issue) => {
              switch (issue.code) {
                case "invalid_type":
                  return ZOD_INVALID_STRING_TYPE
                case "invalid_format":
                  return ZOD_INVALID_CUID_FORMAT(issue.input)
              }
            },
          }),
          name: z.string({
            error: (issue) => {
              switch (issue.code) {
                case "invalid_type":
                  return ZOD_INVALID_STRING_TYPE
              }
            },
          }),
        },
        { error: "Укажите гражданство" }
      )
      .nullish(),
    hireDate: z.coerce
      .date({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_DATETIME_TYPE
          }
        },
      })
      .transform((val) => stripTimezone(val))
      .nullish(),
    firedDate: z.coerce
      .date({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_DATETIME_TYPE
          }
        },
      })
      .transform((val) => stripTimezone(val))
      .nullish(),
    phoneNumber: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .refine((val) => !val || isValidPhoneNumber(val), {
        message: "Неверный формат номера телефона",
      })
      .nullish(),
    email: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .nullish(),
    berth: z
      .object(
        {
          id: z.cuid2({
            error: (issue) => {
              switch (issue.code) {
                case "invalid_type":
                  return ZOD_INVALID_STRING_TYPE
                case "invalid_format":
                  return ZOD_INVALID_CUID_FORMAT(issue.input)
              }
            },
          }),
          name: z.string({
            error: (issue) => {
              switch (issue.code) {
                case "invalid_type":
                  return ZOD_INVALID_STRING_TYPE
              }
            },
          }),
        },
        { error: "Укажите должность" }
      )
      .nullish(),
    department: z
      .object(
        {
          id: z.cuid2({
            error: (issue) => {
              switch (issue.code) {
                case "invalid_type":
                  return ZOD_INVALID_STRING_TYPE
                case "invalid_format":
                  return ZOD_INVALID_CUID_FORMAT(issue.input)
              }
            },
          }),
          name: z.string({
            error: (issue) => {
              switch (issue.code) {
                case "invalid_type":
                  return ZOD_INVALID_STRING_TYPE
              }
            },
          }),
        },
        { error: "Укажите подразделение" }
      )
      .nullish(),
    passports: z
      .array(
        z.object({
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
          series: z.coerce.string().min(4).max(4),
          number: z.coerce.string().min(6).max(6),
          birthDate: z.coerce
            .date({
              error: (issue) => {
                switch (issue.code) {
                  case "invalid_type":
                    return ZOD_INVALID_DATETIME_TYPE
                }
              },
            })
            .transform((val) => stripTimezone(val))
            .nullish(),
          birthPlace: z.string().nullish(),
          issuedBy: z.string().nullish(),
          subdivisionCode: z.string().nullish(),
          issueDate: z.coerce
            .date({
              error: (issue) => {
                switch (issue.code) {
                  case "invalid_type":
                    return ZOD_INVALID_DATETIME_TYPE
                }
              },
            })
            .transform((val) => stripTimezone(val))
            .nullish(),
          registrationAddress: z.string().nullish(),
        })
      )
      .nullish(),
    snilses: z
      .array(
        z.object({
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
          number: z
            .string({
              error: (issue) => {
                switch (issue.code) {
                  case "invalid_type":
                    return ZOD_INVALID_STRING_TYPE
                }
              },
            })
            .refine(SnilsHelper.validateSnils, {
              message: "Неверный номер СНИЛС",
            }),
        })
      )
      .nullish(),
    diplomas: z
      .array(
        z.object({
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
          series: z
            .string({
              error: (issue) => {
                switch (issue.code) {
                  case "invalid_type":
                    return ZOD_INVALID_STRING_TYPE
                }
              },
            })
            .min(1),
          number: z
            .string({
              error: (issue) => {
                switch (issue.code) {
                  case "invalid_type":
                    return ZOD_INVALID_STRING_TYPE
                }
              },
            })
            .min(1),
        })
      )
      .nullish(),
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined
        ? "Сотрудник не указан"
        : ZOD_INVALID_OBJECT_TYPE,
  }
)
