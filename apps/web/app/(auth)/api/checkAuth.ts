"use server"

import { getSessionData } from "@/lib/jose/server/cookies"

/**
 * Функция проверки авторизации
 * @returns Идентификатор пользователя
 */
export const checkAuth = async (): Promise<string> => {
  const sessionData = await getSessionData()

  if (!sessionData) {
    throw new Error("Сессия пользователя не получена")
  }

  return sessionData.user.id
}
