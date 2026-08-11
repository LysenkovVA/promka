"use server"

import { ICompanyEntity } from "../../../model/types/ICompanyEntity"
import { ResponseData } from "@/lib/responses/ResponseData"
import { prisma } from "@workspace/database/prisma"
import { checkAuth } from "@/app/(auth)"

export async function getCompanies(): Promise<
  ResponseData<ICompanyEntity[] | undefined>
> {
  try {
    const userId = await checkAuth()

    const entities = await prisma.company.findMany({
      where: {
        workspace: {
          teamMembers: {
            some: {
              user: {
                id: { equals: userId },
              },
            },
          },
        },
      },
      orderBy: [{ name: "asc" }],
      // include: {
      //   workspace: { include: { teamMembers: { include: { user: true } } } },
      // },
    })

    return ResponseData.Ok<ICompanyEntity[]>(
      JSON.parse(JSON.stringify(entities)) as ICompanyEntity[]
    )
  } catch (error) {
    return ResponseData.InternalServerError(error)
  }
}
