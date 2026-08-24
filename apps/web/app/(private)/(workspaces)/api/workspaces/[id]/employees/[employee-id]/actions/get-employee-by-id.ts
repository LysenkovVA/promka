"use server"

import { ResponseData } from "@/lib/responses/ResponseData"
import { IEmployeeEntity } from "../../../../../../../(employees)/model/types/IEmployeeEntity"
import { prisma } from "@workspace/database/prisma"
import { checkAuth } from "@/app/(public)/(auth)"

export async function getEmployeeById(
  id: string
): Promise<ResponseData<IEmployeeEntity | undefined>> {
  try {
    await checkAuth()

    const candidate = await prisma.employee.findFirst({
      where: { id },
    })

    if (!candidate) {
      return ResponseData.BadRequest([`Сотрудник с ID=${id} не найден`])
    }

    return ResponseData.Ok<IEmployeeEntity>(
      JSON.parse(JSON.stringify(candidate)) as IEmployeeEntity
    )
  } catch (error) {
    return ResponseData.InternalServerError(error)
  }
}
