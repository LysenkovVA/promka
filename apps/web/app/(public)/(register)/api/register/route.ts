"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { validateObject } from "@/lib/zod/validateObject"
import { prisma } from "@workspace/database/prisma"
import {
  RegisterUserResponse,
  RegisterUserResponseSchema,
} from "@/Users/model/types/RegisterUserResponseSchema"
import bcrypt from "bcryptjs"
import { RegisterUserRequestSchema } from "@/Users/model/types/RegisterUserRequestSchema"

export async function POST(
  request: NextRequest
): Promise<NextResponse<ResponseData<RegisterUserResponse | undefined>>> {
  try {
    /**
     * !!! При регистрации авторизованность пользователя не проверяется !!!
     */

    // TODO Защита от большого количества запросов на регистрацию (возможно капча)

    // Получение данных из запроса
    const formData = await request.formData()
    const data = JSON.parse(formData.get("entity-data") as string)

    // Валидация
    const validatedData = await validateObject(RegisterUserRequestSchema, data)

    const createdData = await prisma.user.create({
      data: {
        email: validatedData.email,
        hashedPassword: bcrypt.hashSync(validatedData.password, 10),
      },
    })

    // TODO а надо ли???
    const validateCreatedData = await validateObject(
      RegisterUserResponseSchema,
      createdData
    )

    // const upsertedData = await upsertUser(entityToSave)
    return ResponseData.Created<RegisterUserResponse>(
      validateCreatedData
    ).toNextResponse()
  } catch (error) {
    // Неизвестная ошибка в роуте
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
