"use server"

import { prisma, PrismaTransaction } from "@workspace/database/prisma"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ICompanyEntity } from "../../../../model/types/ICompanyEntity"
import { checkAuth } from "@/app/(auth)"

export async function deleteCompanyByIdAtTransaction(
  id: string,
  prismaTransaction: PrismaTransaction
): Promise<ResponseData<ICompanyEntity | undefined>> {
  try {
    await checkAuth()

    const candidate = await prismaTransaction.company.delete({
      where: { id },
    })

    if (!candidate) {
      return ResponseData.BadRequest([`Организация с ID=${id} не была удалена`])
    }

    return ResponseData.Ok<ICompanyEntity>(
      JSON.parse(JSON.stringify(candidate)) as ICompanyEntity
    )
  } catch (error) {
    return ResponseData.InternalServerError(error)
  }
}

export async function deleteCompanyById(
  id: string
): Promise<ResponseData<ICompanyEntity | undefined>> {
  try {
    return await prisma.$transaction(async (tx: PrismaTransaction) => {
      return await deleteCompanyByIdAtTransaction(id, tx)
    })
  } catch (error) {
    return ResponseData.InternalServerError(error)
  }
}
