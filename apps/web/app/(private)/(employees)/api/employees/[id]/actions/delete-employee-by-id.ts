"use server"

import { prisma, PrismaTransaction } from "@workspace/database/prisma"
import { ResponseData } from "@/lib/responses/ResponseData"
import { IEmployeeEntity } from "../../../../model/types/IEmployeeEntity"
import { checkAuth } from "@/app/(auth)"

export async function deleteEmployeeByIdAtTransaction(
  id: string,
  prismaTransaction: PrismaTransaction
): Promise<ResponseData<IEmployeeEntity | undefined>> {
  try {
    await checkAuth()

    // Удаление записей из Companies и Workspaces
    const candidate = await prismaTransaction.employee.delete({
      where: { id },
    })

    if (!candidate) {
      return ResponseData.BadRequest([`Сотрудник с ID=${id} не был удалён`])
    }

    return ResponseData.Ok<IEmployeeEntity>(
      JSON.parse(JSON.stringify(candidate)) as IEmployeeEntity
    )
  } catch (error) {
    return ResponseData.InternalServerError(error)
  }
}

export async function deleteEmployeeById(
  id: string
): Promise<ResponseData<IEmployeeEntity | undefined>> {
  try {
    return await prisma.$transaction(async (tx: PrismaTransaction) => {
      return await deleteEmployeeByIdAtTransaction(id, tx)
    })
  } catch (error) {
    return ResponseData.InternalServerError(error)
  }
}
