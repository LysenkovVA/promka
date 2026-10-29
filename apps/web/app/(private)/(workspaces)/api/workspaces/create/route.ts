"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuth } from "@/app/(public)/(auth)/api/checkAuth"
import { validateObject } from "@/lib/zod/validateObject"
import { prisma } from "@workspace/database/prisma"
import { ServerError } from "@/lib/responses/ServerError"
import { WorkspaceRequestSchema } from "@/Workspaces/model/types/workspace-request.schema"
import { Workspace } from "@/Workspaces"

export async function POST(
  request: NextRequest
): Promise<NextResponse<ResponseData<Workspace | undefined>>> {
  try {
    // Проверяем доступы пользователя
    const userId = await checkAuth()

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const validatedData = await validateObject(
      WorkspaceRequestSchema,
      entityToSave
    )

    const createdData = await prisma.workspace.create({
      data: {
        company: { create: { name: validatedData.company.name } },
        teamMembers: {
          create: {
            user: { connect: { id: userId } },
            workspaceRole: "WS_ADMINISTRATOR",
            workspacePermissions: { create: {} },
          },
        },
      },
      include: {
        teamMembers: {
          include: {
            user: true,
            workspacePermissions: true,
          },
        },
        company: true,
      },
    })

    // @ts-ignore
    return ResponseData.Ok<Workspace>(createdData).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
