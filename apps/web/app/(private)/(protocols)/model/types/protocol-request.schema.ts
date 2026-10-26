import { z } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_DATETIME_TYPE,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
} from "@/lib/zod/commonErrors"
import { stripTimezone } from "@/lib/date/utils"

export const ProtocolRequestSchema = z.object(
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
    number: z
      .string({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_STRING_TYPE
          }
        },
      })
      .min(1, { error: "Номер не указан" }),
    date: z.coerce
      .date({
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_DATETIME_TYPE
          }
        },
      })
      .transform((val) => stripTimezone(val)),
    certificates: z
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
          certificateType: z.object(
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
            },
            { error: "Укажите тип удостоверения" }
          ),
          number: z
            .string({
              error: (issue) => {
                switch (issue.code) {
                  case "invalid_type":
                    return "Укажите номер удостоверения"
                }
              },
            })
            .min(1, { error: "Укажите номер удостоверения" }),
          date: z.coerce
            .date({
              error: (issue) => {
                switch (issue.code) {
                  case "invalid_type":
                    return ZOD_INVALID_DATETIME_TYPE
                }
              },
            })
            .transform((val) => stripTimezone(val)),
          group: z
            .string({
              error: (issue) => {
                switch (issue.code) {
                  case "invalid_type":
                    return ZOD_INVALID_STRING_TYPE
                }
              },
            })
            .nullish(),
          employee: z.object(
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
            },
            { error: "Укажите сотрудника" }
          ),
        })
      )
      .min(1, "Отсутствуют данные по удостоверениям"),
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined
        ? "Протокол не указан"
        : ZOD_INVALID_OBJECT_TYPE,
  }
)
