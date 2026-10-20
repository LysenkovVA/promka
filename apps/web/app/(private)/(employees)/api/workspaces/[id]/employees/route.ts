"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { Employee } from "../../../../model/types/employee.schema"
import { TAKE } from "@/config/app"
import { ServerError } from "@/lib/responses/ServerError"
import { EmployeeWhereInput } from "@workspace/database/prisma/.generated/models/Employee"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<Employee[] | undefined>>> {
  try {
    const { id } = await props.params
    const { searchParams } = new URL(request.url)

    const take = searchParams.get("take") || TAKE
    const skip = searchParams.get("skip") || 0
    const search = searchParams.get("search") || ""

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    const WHERE: EmployeeWhereInput = {
      workspace: { id: id },
      ...(search && {
        OR: [
          { surname: { contains: search, mode: "insensitive" } },
          { name: { contains: search, mode: "insensitive" } },
          { patronymic: { contains: search, mode: "insensitive" } },
          { phoneNumber: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          {
            berth: {
              name: { contains: search, mode: "insensitive" },
            },
          },
          {
            department: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        ],
      }),
    }

    const data = await prisma.employee.findMany({
      where: WHERE,
      take: Number(take),
      skip: Number(skip),
      include: {
        workspace: { include: { company: true } },
        berth: true,
        department: true,
        certificates: { include: { certificateType: true } },
      },
    })

    const total = await prisma.employee.count({ where: WHERE })

    // @ts-ignore
    return ResponseData.Ok<Employee[]>(data, { total: total }).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
