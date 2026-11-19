"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)"
import { prisma } from "@workspace/database/prisma"
import { TAKE } from "@/config/app"
import { Specialization } from "../../../../model/types/specialization.schema"
import { ServerError } from "@/lib/responses/ServerError"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<Specialization[] | undefined>>> {
  try {
    const { id } = await props.params
    const { searchParams } = new URL(request.url)

    const take = searchParams.get("take") || TAKE
    const skip = searchParams.get("skip") || 0
    const search = searchParams.get("search") || ""

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    const data = await prisma.specialization.findMany({
      where: {
        workspace: { id: id },
        ...(search && {
          specializationDirection: {
            name: { contains: search, mode: "insensitive" },
          },
        }),
      },
      take: Number(take),
      skip: Number(skip),
      orderBy: { specializationDirection: { name: "asc" } },
      include: {
        specializationDirection: true,
        specializationParameter: true,
      },
    })

    // @ts-ignore
    return ResponseData.Ok<Specialization[]>(data).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
