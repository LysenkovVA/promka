/**
 * Не указывать "use client"!!! Будет ошибка
 */

import { ZodError } from "zod/v4"
import { NextResponse } from "next/server"
import { formatZodErrorToMessages } from "@/lib/zod/validateObject"

export interface ResponsePagination {
  take?: number
  skip?: number
  search?: string
  total?: number
}

/**
 * Структура ответа сервера
 */
export class ResponseData<T> {
  readonly isOk: boolean
  readonly status: number
  readonly data: T
  readonly pagination?: ResponsePagination
  readonly statusText: string | undefined = undefined
  readonly errorMessages: string[] | undefined = []

  constructor(
    isOk: boolean,
    status: number,
    data: T,
    pagination?: ResponsePagination,
    statusText?: string,
    errorMessages?: string[]
  ) {
    this.isOk = isOk
    this.status = status
    this.data = data
    this.pagination = pagination
    this.statusText = statusText
    this.errorMessages = errorMessages
  }

  // 200
  static Ok<T>(data: T, pagination?: ResponsePagination, statusText?: string) {
    return new ResponseData<T>(true, 200, data, pagination, statusText)
  }

  // 201
  static Created<T>(
    data: T,
    pagination?: ResponsePagination,
    statusText?: string
  ) {
    return new ResponseData<T>(true, 201, data, pagination, statusText)
  }

  // 400
  static BadRequest(errors: string[] = ["400"]) {
    return new ResponseData<undefined>(
      false,
      400,
      undefined,
      undefined,
      errors[0],
      errors
    )
  }

  // 401
  static NotAuthorized(errors: string[] = ["401"]) {
    return new ResponseData<undefined>(
      false,
      401,
      undefined,
      undefined,
      errors[0],
      errors
    )
  }

  // 403
  static Forbidden(errors: string[] = ["403"]) {
    return new ResponseData<undefined>(
      false,
      403,
      undefined,
      undefined,
      errors[0],
      errors
    )
  }

  // 404
  static NotFound(errors: string[] = ["404"]) {
    return new ResponseData<undefined>(
      false,
      404,
      undefined,
      undefined,
      errors[0],
      errors
    )
  }

  // 500
  static InternalServerError(
    errorInstance: unknown,
    pagination?: ResponsePagination,
    statusText?: string
  ) {
    // console.log(`ErrorInstanse: ${typeof errorInstance}`)
    // if (errorInstance instanceof String) {
    //     return new ResponseData<undefined>(
    //         false,
    //         500,
    //         undefined,
    //         pagination,
    //         String(errorInstance),
    //         [String(errorInstance)],
    //     );
    // }

    // Ошибки Zod
    if (errorInstance instanceof ZodError) {
      const errorMessages = formatZodErrorToMessages(errorInstance)

      return new ResponseData<undefined>(
        false,
        500,
        undefined,
        pagination,
        statusText,
        errorMessages
      )
    }

    // Ошибки Error
    if (errorInstance instanceof Error) {
      return new ResponseData<undefined>(
        false,
        500,
        undefined,
        pagination,
        statusText,
        [errorInstance.message]
      )
    }

    // Все остальные ошибки
    return new ResponseData<undefined>(
      false,
      500,
      undefined,
      pagination,
      statusText,
      [JSON.stringify(errorInstance)]
    )
  }

  static getAllErrors(data: ResponseData<any>): string {
    return data.errorMessages !== undefined
      ? data.errorMessages.join("\n\n")
      : "Ошибка не содержит описания"
  }

  getAllErrors() {
    return this.errorMessages !== undefined
      ? this.errorMessages.join("\n\n")
      : "Ошибка не содержит описания"
  }

  toNextResponse() {
    return NextResponse.json(this, { status: this.status })
  }
}
