"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import {
  CreateTeamMemberRequestSchema,
  CreateTeamMemberResponse,
} from "@/TeamMember"
import { checkAuth } from "@/app/(public)/(auth)"
import { validateObject } from "@/lib/zod/validateObject"
import { prisma } from "@workspace/database/prisma"

/**
 * Создание новой компании пользователя
 * @param request
 * @constructor
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ResponseData<CreateTeamMemberResponse | undefined>>> {
  try {
    // Проверка авторизации
    const userId = await checkAuth()

    // Получение данных запроса
    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    // Валидация
    const validatedData = await validateObject(
      CreateTeamMemberRequestSchema,
      entityToSave
    )

    // Добавление в БД
    const createdData = await prisma.teamMember.create({
      data: {
        user: { connect: { id: userId } },
        teamMemberRole: validatedData.teamMemberRole,
        workspace: {
          create: {
            company: {
              create: {
                name: validatedData.workspace?.company.name,
              },
            },
          },
        },
        workspacePermissions: {
          create: {
            canRead: validatedData.workspacePermissions?.canRead,
            canWrite: validatedData.workspacePermissions?.canWrite,
            canDelete: validatedData.workspacePermissions?.canDelete,
          },
        },
      },
      include: {
        user: true,
        workspace: {
          include: { company: true },
        },
        workspacePermissions: true,
      },
    })

    return ResponseData.Created<CreateTeamMemberResponse>(
      createdData
    ).toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
