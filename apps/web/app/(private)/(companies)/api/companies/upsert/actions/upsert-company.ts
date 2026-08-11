"use server"

import { ICompanyEntity } from "@/app/(private)/(companies)"
import {
  prisma,
  prismaNonExistentId,
  PrismaTransaction,
} from "@workspace/database/prisma"
import { ResponseData } from "@/lib/responses/ResponseData"
import { validateObject } from "@/lib/zod/validateObject"
import { CompanyEntitySchema } from "@/app/(private)/(companies)/model/types/CompanyEntitySchema"
import { Prisma } from "@workspace/database/.generated/client"

export async function upsertCompanyAtTransaction(
  data: ICompanyEntity,
  userId: string,
  prismaTransaction: PrismaTransaction
): Promise<ResponseData<ICompanyEntity | undefined>> {
  try {
    const validatedData = await validateObject(CompanyEntitySchema, data)

    // const candidate = await prismaTransaction.company.findFirst({
    //   where: {
    //     name: { equals: validatedData.name, mode: "insensitive" },
    //   },
    // })
    //
    // if (!validatedData.id && candidate) {
    //   return ResponseData.InternalServerError(
    //     new Error(
    //       `'${validatedData.name}' уже существует! Выберите другое название`
    //     )
    //   )
    // }

    const upsertedData = await prismaTransaction.company.upsert({
      where: { id: validatedData.id || prismaNonExistentId },
      create: {
        name: validatedData.name,
        address: validatedData.address ?? Prisma.skip,
        workspace: {
          create: {
            teamMembers: {
              create: {
                user: { connect: { id: userId } },
                teamMemberRole: "ADMIN",
                workspacePermissions: {
                  create: {
                    canRead: true,
                    canWrite: true,
                    canDelete: true,
                  },
                },
              },
            },
          },
        },
      },
      update: {
        name: validatedData.name,
        address: validatedData.address ?? Prisma.skip,
      },
    })

    return ResponseData.Ok<ICompanyEntity>(
      JSON.parse(JSON.stringify(upsertedData)) as ICompanyEntity
    )
  } catch (error) {
    return ResponseData.InternalServerError(error)
  }
}

export async function upsertCompany(
  validatedData: ICompanyEntity,
  userId: string
): Promise<ResponseData<ICompanyEntity | undefined>> {
  try {
    return await prisma.$transaction(async (tx: PrismaTransaction) => {
      return await upsertCompanyAtTransaction(validatedData, userId, tx)
    })
  } catch (error) {
    return ResponseData.InternalServerError(error)
  }
}
