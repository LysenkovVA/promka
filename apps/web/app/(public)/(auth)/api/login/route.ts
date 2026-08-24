"use server"

import { NextRequest, NextResponse } from "next/server"
import { validateObject } from "@/lib/zod/validateObject"
import { LoginSchema } from "@/app/(public)/(auth)/model/types/LoginSchema"
import { ResponseData } from "@/lib/responses/ResponseData"
import { prisma } from "@workspace/database/prisma"
import bcrypt from "bcryptjs"
import { SessionData } from "@/lib/jose/types/sessionData"
import { createAccessToken, createRefreshToken } from "@/lib/jose/client/tokens"
import { IAuthData } from "@/app/(public)/(auth)/model/types/IAuthData"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Получение данных из запроса
    const data = await request.json()

    // Валидация данных
    const validatedData = await validateObject(LoginSchema, data)

    // Поиск пользователя в БД
    const candidate = await prisma.user.findFirst({
      where: { email: validatedData.email },
      include: {
        avatar: true,
        teamMembers: {
          include: {
            workspace: { include: { company: true } },
            workspacePermissions: true,
          },
          orderBy: {
            workspace: { company: { name: "asc" } },
          },
        },
      },
    })

    // Пользователь не найден
    if (!candidate) {
      return ResponseData.BadRequest([
        `Пользователь '${validatedData.email}' не зарегистрирован`,
      ]).toNextResponse()
    }

    // Проверка пароля пользователя
    if (!bcrypt.compareSync(validatedData.password, candidate.hashedPassword)) {
      return ResponseData.BadRequest(["Неправильный пароль"]).toNextResponse()
    }

    /**
     * 1. Генерируем access токен
     */
    const expiresInAccess = new Date(
      Date.now() + Number(process.env.ACCESS_TOKEN_LIVE_NUMBER)
    )
    const tokenData: SessionData = {
      user: { id: candidate.id },
      expiresAt: expiresInAccess.toISOString(),
    }

    const encryptedSessionAccessToken = await createAccessToken(tokenData)

    const response = ResponseData.Ok<IAuthData>({
      user: {
        ...candidate,
      },
    }).toNextResponse()

    // Генерируем refreshToken
    const encryptedSessionRefreshToken = await createRefreshToken(tokenData)

    // Генерируем срок жизни refresh токена
    const expiresIn = new Date(
      Date.now() + Number(process.env.REFRESH_TOKEN_LIVE_NUMBER)
    )

    // Устанавливаем куку
    response.cookies.set("accessToken", encryptedSessionAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresInAccess,
    })

    response.cookies.set("refreshToken", encryptedSessionRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresIn,
    })

    return response
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
