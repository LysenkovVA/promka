"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { TAKE } from "@/config/app"
import { BerthType } from "../../../../model/types/berth-type.schema"
import { ServerError } from "@/lib/responses/ServerError"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<BerthType[] | undefined>>> {
  try {
    const { id } = await props.params
    const { searchParams } = new URL(request.url)

    const take = searchParams.get("take") || TAKE
    const skip = searchParams.get("skip") || 0
    const search = searchParams.get("search") || ""

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    const data = await prisma.berthType.findMany({
      where: {
        workspace: { id: id },
        ...(search && { name: { contains: search, mode: "insensitive" } }),
      },
      include: {
        workspace: { include: { company: true } },
      },
      take: Number(take),
      skip: Number(skip),
      orderBy: { name: "asc" },
    })

    // @ts-ignore
    return ResponseData.Ok<BerthType[]>(data).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
