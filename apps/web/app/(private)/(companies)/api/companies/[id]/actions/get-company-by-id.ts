"use server"

import { ResponseData } from "@/lib/responses/ResponseData"
import { ICompanyEntity } from "../../../../model/types/ICompanyEntity"
import { prisma } from "@workspace/database/prisma"
import { checkAuth } from "@/app/(auth)"

export async function getCompanyById(
  id: string
): Promise<ResponseData<ICompanyEntity | undefined>> {
  try {
    await checkAuth()

    const candidate = await prisma.company.findFirst({
      where: { id },
      include: { workspace: true },
    })

    if (!candidate) {
      return ResponseData.BadRequest([`Организация с ID=${id} не найдена`])
    }

    return ResponseData.Ok<ICompanyEntity>(
      JSON.parse(JSON.stringify(candidate)) as ICompanyEntity
    )
  } catch (error) {
    return ResponseData.InternalServerError(error)
  }
}
