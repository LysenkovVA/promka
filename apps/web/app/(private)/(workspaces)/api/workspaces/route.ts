"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuth } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { TAKE } from "@/config/app"
import { ServerError } from "@/lib/responses/ServerError"
import { WorkspaceWhereInput } from "@workspace/database/prisma/.generated/models/Workspace"
import { Workspace } from "../../model/types/workspace.schema"

export async function GET(
  request: NextRequest
): Promise<NextResponse<ResponseData<Workspace[] | undefined>>> {
  try {
    const { searchParams } = new URL(request.url)

    const take = searchParams.get("take") || TAKE
    const skip = searchParams.get("skip") || 0
    const search = searchParams.get("search") || ""

    // Проверяем доступы пользователя
    const userId = await checkAuth()

    const WHERE: WorkspaceWhereInput = {
      teamMembers: {
        some: {
          user: { id: userId },
        },
      },
    }

    const data = await prisma.workspace.findMany({
      where: WHERE,
      take: Number(take),
      skip: Number(skip),
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

    const total = await prisma.workspace.count({ where: WHERE })

    // @ts-ignore
    return ResponseData.Ok<Workspace[]>(data, { total: total }).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
