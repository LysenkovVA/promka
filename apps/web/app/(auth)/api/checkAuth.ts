"use server"

import { getSessionData } from "@/lib/jose/server/cookies"
import { prisma } from "@workspace/database/prisma"

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

export const checkAuthForWorkspace = async (
  workspaceId: string
): Promise<string> => {
  const sessionData = await getSessionData()

  if (!sessionData) {
    throw new Error("Сессия пользователя не получена")
  }

  const workspace = await prisma.workspace.findFirst({
    where: {
      AND: {
        id: { equals: workspaceId },
        teamMembers: {
          some: {
            user: {
              id: { equals: sessionData.user.id },
            },
          },
        },
      },
    },
  })

  if (!workspace) {
    throw new Error("Доступ запрещён")
  }

  return sessionData.user.id
}
