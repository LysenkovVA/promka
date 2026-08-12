"use server"

import { IEmployeeEntity } from "../../../model/types/IEmployeeEntity"
import { ResponseData } from "@/lib/responses/ResponseData"
import { prisma } from "@workspace/database/prisma"
import { checkAuthForWorkspace } from "@/app/(auth)/api/checkAuth"

export async function getEmployees(
  workspaceId: string
): Promise<ResponseData<IEmployeeEntity[] | undefined>> {
  try {
    const userId = await checkAuthForWorkspace(workspaceId)

    const entities = await prisma.employee.findMany({
      where: {
        workspace: {
          AND: {
            id: { equals: workspaceId },
            teamMembers: {
              some: {
                user: {
                  id: { equals: userId },
                },
              },
            },
          },
        },
      },
      orderBy: [{ surname: "asc" }],
    })

    return ResponseData.Ok<IEmployeeEntity[]>(
      JSON.parse(JSON.stringify(entities)) as IEmployeeEntity[]
    )
  } catch (error) {
    return ResponseData.InternalServerError(error)
  }
}
