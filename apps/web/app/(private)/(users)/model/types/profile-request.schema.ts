import { z } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_DATETIME_TYPE,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
} from "@/lib/zod/commonErrors"
import { stripTimezone } from "@/lib/date/utils"
import { isValidPhoneNumber } from "react-phone-number-input/input"

// Функция валидации контрольной суммы СНИЛС
const validateSnils = (snils: string) => {
  if (!snils) return true

  // Убираем все символы, кроме цифр
  const cleanSnils = snils.replace(/\D/g, "")

  if (cleanSnils.length !== 11) return false

  // Проверка на зарезервированные последовательности
  if (parseInt(cleanSnils.slice(0, 9)) <= 1001998) return true

  const digits = cleanSnils.slice(0, 9).split("").map(Number)
  const checksum = parseInt(cleanSnils.slice(9, 11))

  let sum = 0
  for (let i = 0; i < 9; i++) {
    // @ts-ignore
    sum += digits[i] * (9 - i)
  }

  let calculatedChecksum = 0
  if (sum < 100) {
    calculatedChecksum = sum
  } else if (sum === 100 || sum === 101) {
    calculatedChecksum = 0
  } else {
    const remainder = sum % 101
    calculatedChecksum = remainder === 100 || remainder === 101 ? 0 : remainder
  }

  return calculatedChecksum === checksum
}

/**
 * Схема валидации ProfileRequestSchema
 */
export const ProfileRequestSchema = z.object(
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
    snils: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .refine(validateSnils, { message: "Неверный номер СНИЛС" })
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
    // certificates: z
    //   .array(
    //     z.object({
    //       id: z
    //         .cuid2({
    //           error: (issue) => {
    //             switch (issue.code) {
    //               case "invalid_type":
    //                 return ZOD_INVALID_STRING_TYPE
    //               case "invalid_format":
    //                 return ZOD_INVALID_CUID_FORMAT(issue.input)
    //             }
    //           },
    //         })
    //         .nullish(),
    //       certificateType: z.object(
    //         {
    //           id: z.cuid2({
    //             error: (issue) => {
    //               switch (issue.code) {
    //                 case "invalid_type":
    //                   return ZOD_INVALID_STRING_TYPE
    //                 case "invalid_format":
    //                   return ZOD_INVALID_CUID_FORMAT(issue.input)
    //               }
    //             },
    //           }),
    //         },
    //         { error: "Укажите тип удостоверения" }
    //       ),
    //       number: z
    //         .string({
    //           error: (issue) => {
    //             switch (issue.code) {
    //               case "invalid_type":
    //                 return "Укажите номер удостоверения"
    //             }
    //           },
    //         })
    //         .min(1, { error: "Укажите номер удостоверения" }),
    //       date: z.coerce
    //         .date({
    //           error: (issue) => {
    //             switch (issue.code) {
    //               case "invalid_type":
    //                 return ZOD_INVALID_DATETIME_TYPE
    //             }
    //           },
    //         })
    //         .transform((val) => stripTimezone(val)),
    //       group: z
    //         .string({
    //           error: (issue) => {
    //             switch (issue.code) {
    //               case "invalid_type":
    //                 return ZOD_INVALID_STRING_TYPE
    //             }
    //           },
    //         })
    //         .nullish(),
    //       protocol: z.object(
    //         {
    //           id: z.cuid2({
    //             error: (issue) => {
    //               switch (issue.code) {
    //                 case "invalid_type":
    //                   return ZOD_INVALID_STRING_TYPE
    //                 case "invalid_format":
    //                   return ZOD_INVALID_CUID_FORMAT(issue.input)
    //               }
    //             },
    //           }),
    //         },
    //         { error: "Укажите протокол" }
    //       ),
    //     })
    //   )
    //   .nullish(),
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined ? "Профиль не указан" : ZOD_INVALID_OBJECT_TYPE,
  }
)
