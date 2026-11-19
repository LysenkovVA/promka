"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"
import { prisma } from "@workspace/database/prisma"
import { ServerError } from "@/lib/responses/ServerError"
import { Study } from "@/Studies/model/types/study.schema"

/**
 * Получение всех обучений сотрудника по его идентификатору
 * @param request
 * @param props
 * @constructor
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; "employee-id": string }> }
): Promise<NextResponse<ResponseData<Study[] | undefined>>> {
  try {
    const { id, "employee-id": employeeId } = await props.params

    await checkAuthForWorkspace(id)

    const candidate = await prisma.study.findMany({
      distinct: ["id"],
      where: {
        OR: [
          { employees: { some: { id: employeeId } } },
          {
            certificates: {
              some: {
                employee: { id: employeeId },
              },
            },
          },
        ],
      },
      include: {
        specialization: {
          include: {
            specializationDirection: true,
            specializationParameter: true,
          },
        },
        certificates: {
          include: { employee: true },
          where: { employee: { id: employeeId } },
        },
        employees: { where: { id: employeeId } },
        protocol: { include: { studyOrganization: true } },
        workspace: { include: { company: true } },
      },
    })

    if (!candidate)
      return ResponseData.BadRequest(["Сотрудник не найден"]).toNextResponse()

    // @ts-ignore
    return ResponseData.Ok<Employee>(candidate).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
