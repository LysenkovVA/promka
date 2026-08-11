"use server"

import { cookies } from "next/headers"
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../client/tokens"
import { SessionData } from "../types/sessionData"

/**
 * Получение сессии пользователя из файлов cookie
 */
export async function getSessionData(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value

    if (!accessToken) return null

    return await verifyAccessToken(accessToken)
  } catch (error) {
    // Console.Error(
    //   `[SERVER][${dayjs().format("HH:mm:ss")}][Ошибка при получении сессии]`
    // )
    // Console.Error(ResponseData.Error(error).getAllErrors())
    return null
  }
}
// export async function getSession(): Promise<SessionData | null> {
//     try {
//         // Получаем access token
//         let session = (await cookies()).get("accessToken")?.value;
//         console.log("getting access token...");
//
//         // Если access токен невалиден
//         if (!session) {
//             console.log(
//                 "getting generating new access token with refresh token...",
//             );
//             // Обновление access токена с помощью refresh токена
//             const accessTokenIsUpdated = await refreshSession();
//
//             // Если access токен не обновился, значит refresh токен невалиден
//             // и пользователю необходимо заново залогиниться
//             if (!accessTokenIsUpdated) return null;
//
//             console.log("getting new access token...");
//             // Получаем обновленный access токен
//             session = (await cookies()).get("accessToken")?.value;
//         }
//
//         if (!session) return null;
//
//         return await verifyAccessToken(session);
//     } catch (error) {
//         Console.Error(
//             `[SERVER][${dayjs(Date.now()).format("HH:mm:ss")}][Произошла ошибка при получении сессии пользователя]`,
//         );
//         Console.Error(ResponseData.Error(error).getAllErrors());
//         return null;
//     }
// }

/**
 * Установка сессии пользователя или вход (установка access и refresh токенов в файлы cookie)
 * @param userId Идентификатор пользователя
 * @returns access токен
 */
export async function generateAccessTokenAndSetRefreshTokenToCookie(
  userId: string
): Promise<string | undefined> {
  try {
    /**
     * 1. Генерируем access токен
     */
    const expiresInAccess = new Date(
      Date.now() + Number(process.env.ACCESS_TOKEN_LIVE_NUMBER)
    )
    const sessionAccess: SessionData = {
      user: { id: userId },
      expiresAt: expiresInAccess.toISOString(),
    }
    const encryptedSessionAccessToken = await createAccessToken(sessionAccess)

    /**
     * 2. Генерируем refresh токен
     */
    const expiresInRefresh = new Date(
      Date.now() + Number(process.env.REFRESH_TOKEN_LIVE_NUMBER)
    )
    const sessionRefresh: SessionData = {
      user: { id: userId },
      expiresAt: expiresInRefresh.toISOString(),
    }
    const encryptedSessionRefreshToken =
      await createRefreshToken(sessionRefresh)

    /**
     * 3. Устанавливаем access и refresh токены в файлы cookie
     */
    // (await cookies()).set("accessToken", encryptedSessionAccessToken, {
    //     expires: expiresInAccess,
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "lax",
    // });

    ;(await cookies()).set("refreshToken", encryptedSessionRefreshToken, {
      expires: expiresInRefresh,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    })

    // Console.Success(
    //   `[SERVER][${dayjs(Date.now()).format("HH:mm:ss")}][Вход пользователя выполнен]`
    // )
    return encryptedSessionRefreshToken
  } catch (error) {}
}

/**
 * Обновление refresh токена
 */
export async function refreshSession() {
  try {
    /**
     * 1. Получение refresh токена из cookies
     */
    const refreshToken = (await cookies()).get("refreshToken")?.value
    if (!refreshToken) return false

    /**
     * 2. Верификация refresh токена
     */
    const sessionData = await verifyRefreshToken(refreshToken)
    // Если проверка refresh токена не прошла
    if (!sessionData) return false

    /**
     * 3. Получаем файлы cookies и очищаем старый access токен
     */
    const c = await cookies()
    c.delete("accessToken")

    /**
     * 4. Генерируем новый access токен
     */
    // Срок действия
    const expiresIn = new Date(
      Date.now() + Number(process.env.ACCESS_TOKEN_LIVE_NUMBER)
    )
    // Данные внутри access токена
    const session: SessionData = {
      user: { id: sessionData.user.id },
      expiresAt: expiresIn.toISOString(),
    }
    // Зашифрованные данные access токена
    const encryptedSessionAccessToken = await createAccessToken(session)

    /**
     * 5. Устанавливаем access токен в cookies
     */
    ;(await cookies()).set("accessToken", encryptedSessionAccessToken, {
      expires: expiresIn,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    })

    // Console.Success(
    //   `[SERVER][${dayjs(Date.now()).format("HH:mm:ss")}][Access токен обновлён]`
    // )

    return true
  } catch (error) {
    // Console.Error(
    //   `[SERVER][${dayjs(Date.now()).format("HH:mm:ss")}][Произошла ошибка при обновлении access токена]`
    // )
    // Console.Error(ResponseData.Error(error).getAllErrors())
    return false
  }
}

/**
 * Очистка всех файлов cookie пользователя (logout пользователя)
 */
export async function clearSession() {
  try {
    const c = await cookies()
    c.getAll().forEach((cookie) => c.delete(cookie.name))
    // Console.Success(
    //   `[SERVER][${dayjs(Date.now()).format("HH:mm:ss")}][Пользователь завершил сеанс. Данные сессии очищены. Файлы cookie удалены.]`
    // )
  } catch (error) {
    // Console.Error(
    //   `[SERVER][${dayjs(Date.now()).format("HH:mm:ss")}][Произошла ошибка при завершении сеанса пользователя]`
    // )
    // Console.Error(ResponseData.Error(error).getAllErrors())
  }
}
