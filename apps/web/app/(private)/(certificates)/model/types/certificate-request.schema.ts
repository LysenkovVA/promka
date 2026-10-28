import { z } from "zod/v4"
import {
  ZOD_INVALID_CUID_FORMAT,
  ZOD_INVALID_DATETIME_TYPE,
  ZOD_INVALID_OBJECT_TYPE,
  ZOD_INVALID_STRING_TYPE,
} from "@/lib/zod/commonErrors"
import { stripTimezone } from "@/lib/date/utils"

export const CertificateRequestSchema = z.object(
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
        name: z.string({
          error: (issue) => {
            switch (issue.code) {
              case "invalid_type":
                return ZOD_INVALID_STRING_TYPE
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
    // TODO Учитывать наличие, если есть группы в типе удостоверения
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
      },
      { error: "Укажите сотрудника" }
    ),
    protocol: z.object(
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
      },
      { error: "Укажите протокол" }
    ),
  },
  /**
   * Параметры объекта
   */
  {
    error: (issue) =>
      issue.input === undefined
        ? "Удостоверение не указано"
        : ZOD_INVALID_OBJECT_TYPE,
  }
)
