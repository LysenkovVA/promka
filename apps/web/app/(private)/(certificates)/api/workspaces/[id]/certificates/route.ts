"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { TAKE } from "@/config/app"
import { Certificate } from "../../../../model/types/certificate.schema"
import { ServerError } from "@/lib/responses/ServerError"
import { CertificateWhereInput } from "@workspace/database/prisma/.generated/models/Certificate"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<Certificate[] | undefined>>> {
  try {
    const { id } = await props.params
    const { searchParams } = new URL(request.url)

    const take = searchParams.get("take") || TAKE
    const skip = searchParams.get("skip") || 0
    const search = searchParams.get("search") || ""

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    const WHERE: CertificateWhereInput = {
      workspace: { id: id },
      ...(search && { name: { contains: search, mode: "insensitive" } }),
    }

    const data = await prisma.certificate.findMany({
      where: WHERE,
      include: {
        workspace: { include: { company: true } },
        certificateType: true,
        employee: {
          include: {
            department: true,
            berth: { include: { berthType: true } },
          },
        },
      },
      take: Number(take),
      skip: Number(skip),
      orderBy: { date: "desc" },
    })

    const total = await prisma.certificate.count({
      where: WHERE,
    })

    // @ts-ignore
    return ResponseData.Ok<Certificate[]>(data, {
      total: total,
    }).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
