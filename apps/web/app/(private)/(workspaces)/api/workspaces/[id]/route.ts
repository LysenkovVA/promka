"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { Workspace } from "../../../model/types/workspace.schema"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<Workspace | undefined>>> {
  try {
    const { id } = await props.params

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    const candidate = await prisma.workspace.findFirst({
      where: { id },
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

    return ResponseData.Ok<Workspace>(candidate as Workspace).toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
