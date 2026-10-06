import { Prisma } from "@workspace/database/.generated/client"
import { ResponseData } from "@/lib/responses/ResponseData"
import { NextResponse } from "next/server"

export class ServerError {
  static toNextResponse(
    errorInstance: unknown
  ): NextResponse<ResponseData<undefined>> {
    // Ошибки Prisma
    // 1. Проверяем, является ли ошибка известной ошибкой запроса Prisma
    if (errorInstance instanceof Prisma.PrismaClientKnownRequestError) {
      // Обработка конкретных кодов ошибок Prisma
      switch (errorInstance.code) {
        case "P2000":
          return ResponseData.InternalServerError(
            `Prisma: Значение слишком велико для колонки/поля (${errorInstance.meta?.target})`
          ).toNextResponse()
        case "P2002":
          return ResponseData.InternalServerError(
            `Prisma: Нарушение ограничения уникальности (${errorInstance.meta?.target})`
          ).toNextResponse()
        case "P2003":
          return ResponseData.InternalServerError(
            // @ts-ignore
            `Внешний ключ ${errorInstance.meta?.driverAdapterError?.cause?.constraint?.index} ЗАПРЕЩАЕТ выполнение операции на уровне базы данных`
          ).toNextResponse()
        case "P2025":
          return ResponseData.InternalServerError(
            `Запись, необходимая для выполнения операции, не найдена (проверьте правильно ли вызывается API)`
          ).toNextResponse()
        default:
          return ResponseData.InternalServerError(
            `Prisma: Известная ошибка Prisma (Код: ${errorInstance.code})`
          ).toNextResponse()
      }
    }

    // 2. Ошибка валидации (неверные типы данных перед отправкой в БД)
    if (errorInstance instanceof Prisma.PrismaClientValidationError) {
      return ResponseData.InternalServerError(
        `Prisma: Ошибка валидации данных Prisma: ${errorInstance.message}`
      ).toNextResponse()
    }

    // 3. Ошибка инициализации (база упала или неверный URL)
    if (errorInstance instanceof Prisma.PrismaClientInitializationError) {
      return ResponseData.InternalServerError(
        `Prisma: Не удалось подключиться к базе данных: ${errorInstance.message}`
      ).toNextResponse()
    }

    return ResponseData.InternalServerError(errorInstance).toNextResponse()
  }
}
