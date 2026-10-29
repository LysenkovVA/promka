"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)"
import { prisma } from "@workspace/database/prisma"
import { TAKE } from "@/config/app"
import { Department } from "../../../../model/types/department.schema"
import { ServerError } from "@/lib/responses/ServerError"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<Department[] | undefined>>> {
  try {
    const { id } = await props.params
    const { searchParams } = new URL(request.url)

    const take = searchParams.get("take") || TAKE
    const skip = searchParams.get("skip") || 0
    const search = searchParams.get("search") || ""

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    const data = await prisma.department.findMany({
      where: {
        workspace: { id: id },
        ...(search && { name: { contains: search, mode: "insensitive" } }),
      },
      take: Number(take),
      skip: Number(skip),
      orderBy: { name: "asc" },
    })

    // @ts-ignore
    return ResponseData.Ok<Department[]>(data).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
