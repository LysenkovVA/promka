"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { TAKE } from "@/config/app"
import { Protocol } from "../../../../model/types/protocol.schema"
import { ServerError } from "@/lib/responses/ServerError"
import { ProtocolWhereInput } from "@workspace/database/prisma/.generated/models/Protocol"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<Protocol[] | undefined>>> {
  try {
    const { id } = await props.params
    const { searchParams } = new URL(request.url)

    const take = searchParams.get("take") || TAKE
    const skip = searchParams.get("skip") || 0
    const search = searchParams.get("search") || ""

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    const WHERE: ProtocolWhereInput = {
      workspace: { id: id },
      ...(search && { number: { contains: search, mode: "insensitive" } }),
    }

    const data = await prisma.protocol.findMany({
      where: WHERE,
      include: {
        certificates: true,
      },
      take: Number(take),
      skip: Number(skip),
      orderBy: { date: "desc" },
    })

    const total = await prisma.protocol.count({
      where: WHERE,
    })

    // @ts-ignore
    return ResponseData.Ok<Protocol[]>(data, {
      total: total,
    }).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
