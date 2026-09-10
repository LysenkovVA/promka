"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { Berth } from "../../../../model/types/berth.schema"
import { TAKE } from "@/config/app"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<Berth[] | undefined>>> {
  try {
    const { id } = await props.params
    const { searchParams } = new URL(request.url)

    const take = searchParams.get("take") || TAKE
    const skip = searchParams.get("skip") || 0
    const search = searchParams.get("search") || ""

    console.log("Search=", search)

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    const data = await prisma.berth.findMany({
      where: {
        workspace: { id: id },
        ...(search && { name: { contains: search, mode: "insensitive" } }),
      },
      take: Number(take),
      skip: Number(skip),
      orderBy: { name: "asc" },
    })

    // @ts-ignore
    return ResponseData.Ok<Berth[]>(data).toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
