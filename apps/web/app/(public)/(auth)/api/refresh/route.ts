import { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { ResponseData } from "@/lib/responses/ResponseData"
import { createAccessToken, verifyRefreshToken } from "@/lib/jose/client/tokens"
import { SessionData } from "@/lib/jose/types/sessionData"
import { prisma } from "@workspace/database/prisma"
import { IAuthData } from "@/app/(public)/(auth)/model/types/IAuthData"

/**
 * Обновление access token
 * @param request
 * @constructor
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("refreshToken")?.value

    if (!refreshToken) {
      return ResponseData.Forbidden(["Сессия истекла"]).toNextResponse()
    }

    // Проверяем refreshToken
    const session = await verifyRefreshToken(refreshToken)

    if (!session?.user.id) {
      return ResponseData.Forbidden([
        "Не удалось проверить refresh токен. Доступ запрещён",
      ]).toNextResponse()
    }

    const user = await prisma.user.findFirst({
      where: { id: session.user.id },
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

    if (!user) {
      return ResponseData.Forbidden([
        "Пользователь не найден. Доступ запрещён",
      ]).toNextResponse()
    }

    /**
     * Генерируем access токен
     */
    const expiresInAccess = new Date(
      Date.now() + Number(process.env.ACCESS_TOKEN_LIVE_NUMBER)
    )
    const tokenData: SessionData = {
      user: { id: session.user.id },
      expiresAt: expiresInAccess.toISOString(),
    }

    const encryptedSessionAccessToken = await createAccessToken(tokenData)

    const response = ResponseData.Ok<IAuthData>({ user }).toNextResponse()

    // Удаляем старую куку
    response.cookies.delete("accessToken")

    // Устанавливаем куку
    response.cookies.set("accessToken", encryptedSessionAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresInAccess,
    })

    return response
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
