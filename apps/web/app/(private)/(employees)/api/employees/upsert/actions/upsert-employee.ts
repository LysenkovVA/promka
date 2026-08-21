"use server"

import {
  prisma,
  prismaNonExistentId,
  PrismaTransaction,
} from "@workspace/database/prisma"
import { ResponseData } from "@/lib/responses/ResponseData"
import { validateObject } from "@/lib/zod/validateObject"
import { Prisma } from "@workspace/database/.generated/client"
import { IEmployeeEntity } from "../../../../model/types/IEmployeeEntity"
import { EmployeeEntitySchema } from "../../../../model/types/EmployeeEntitySchema"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)/api/checkAuth"

export async function upsertEmployeeAtTransaction(
  data: IEmployeeEntity,
  workspaceId: string,
  prismaTransaction: PrismaTransaction
): Promise<ResponseData<IEmployeeEntity | undefined>> {
  try {
    console.log(
      "Upsert Employee: ",
      JSON.stringify(data, null, 2),
      "WID=",
      workspaceId
    )
    await checkAuthForWorkspace(workspaceId)

    console.log("Auth OK")

    const validatedData = await validateObject(EmployeeEntitySchema, data)

    console.log("Validation OK")
    console.log("Validated data:", JSON.stringify(validatedData, null, 2))

    const upsertedData = await prismaTransaction.employee.upsert({
      where: { id: validatedData.id || prismaNonExistentId },
      create: {
        surname: validatedData.surname,
        name: validatedData.name ?? Prisma.skip,
        workspace: {
          connect: { id: workspaceId },
        },
      },
      update: {
        surname: validatedData.surname,
        name: validatedData.name ?? Prisma.skip,
        workspace: {
          connect: { id: workspaceId },
        },
      },
    })

    console.log("Employee upserted successfully")

    return ResponseData.Ok<IEmployeeEntity>(
      JSON.parse(JSON.stringify(upsertedData)) as IEmployeeEntity
    )
  } catch (error) {
    return ResponseData.InternalServerError(error)
  }
}

export async function upsertEmployee(
  validatedData: IEmployeeEntity,
  workspaceId: string
): Promise<ResponseData<IEmployeeEntity | undefined>> {
  try {
    return await prisma.$transaction(async (tx: PrismaTransaction) => {
      return await upsertEmployeeAtTransaction(validatedData, workspaceId, tx)
    })
  } catch (error) {
    return ResponseData.InternalServerError(error)
  }
}
