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

    // Поскольку удаление компании является сложной операцией из-за связей таблиц, необходимо
    // делать удаление последовательно, чтобы не было ошибок БД
    // При удалении компании необходимо очистить данные в 4 таблицах: Companies, WorkspacePermissions, Workspaces и TeamMembers.
    // Сначала необходимо удалять записи в таблице TeamMember, что так же удалит и связанные записи из таблицы WorkspacePermissions
    // Затем необходимо удалить саму компанию из таблицы Companies. что так же удалит связанные записи из таблицы Workspaces

    // Удаление записей из TeamMembers и WorkspacePermissions
    await prismaTransaction.teamMember.deleteMany({
      where: {
        workspace: {
          company: {
            id: { equals: id },
          },
        },
      },
    })

    // Удаление записей из Companies и Workspaces
    const candidate = await prismaTransaction.company.delete({
      where: { id },
    })

    if (!candidate) {
      return ResponseData.BadRequest([`Организация с ID=${id} не была удалена`])
    }

    // const workspace = await prismaTransaction.workspace.findFirst({
    //   where: {
    //     company: {
    //       id: id,
    //     },
    //   },
    //   include: {
    //     company: true,
    //   },
    // })
    //
    // if (!workspace) {
    //   return ResponseData.BadRequest([`Организация с ID=${id} не была удалена`])
    // }

    // await prismaTransaction.workspace.delete({ where: { id: workspace.id } })

    // const candidate = await prismaTransaction.company.delete({
    //   where: { id },
    // })
    //
    // if (!candidate) {
    //   return ResponseData.BadRequest([`Организация с ID=${id} не была удалена`])
    // }

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
