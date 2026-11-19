"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { checkAuthForWorkspace } from "@/app/(public)/(auth)"
import { prisma } from "@workspace/database/prisma"
import { TAKE } from "@/config/app"
import { Study } from "../../../../model/types/study.schema"
import { ServerError } from "@/lib/responses/ServerError"
import { StudyWhereInput } from "@workspace/database/prisma/.generated/models/Study"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<Study[] | undefined>>> {
  try {
    const { id } = await props.params
    const { searchParams } = new URL(request.url)

    const take = searchParams.get("take") || TAKE
    const skip = searchParams.get("skip") || 0
    const search = searchParams.get("search") || ""

    // Проверяем доступы пользователя
    await checkAuthForWorkspace(id)

    // TODO Еще поля для поиска
    const WHERE: StudyWhereInput = {
      workspace: { id: id },
      ...(search && {
        OR: [
          // { number: { contains: search, mode: "insensitive" } },
          // {
          //   protocol: {
          //     number: { contains: search, mode: "insensitive" },
          //   },
          // },
        ],
      }),
    }

    const data = await prisma.study.findMany({
      where: WHERE,
      include: {
        specialization: {
          include: {
            specializationDirection: true,
            specializationParameter: true,
          },
        },
        employees: {
          include: {
            berth: { include: { berthType: true } },
            department: true,
            studies: {
              include: {
                protocol: {
                  include: {
                    studyOrganization: true,
                    workspace: { include: { company: true } },
                  },
                },
              },
            },
            workspace: { include: { company: true } },
          },
        },
        certificates: {
          include: {
            study: {
              include: {
                specialization: {
                  include: {
                    specializationDirection: true,
                    specializationParameter: true,
                  },
                },
                protocol: {
                  include: {
                    studyOrganization: true,
                    workspace: { include: { company: true } },
                  },
                },
              },
            },
            employee: {
              include: {
                berth: { include: { berthType: true } },
                department: true,
              },
            },
            workspace: { include: { company: true } },
          },
        },
        protocol: {
          include: {
            studyOrganization: true,
            workspace: { include: { company: true } },
          },
        },
        workspace: { include: { company: true } },
      },
      take: Number(take),
      skip: Number(skip),
      // orderBy: { date: "desc" },
    })

    const total = await prisma.study.count({
      where: WHERE,
    })

    // @ts-ignore
    return ResponseData.Ok<Study[]>(data, {
      total: total,
    }).toNextResponse()
  } catch (error) {
    return ServerError.toNextResponse(error)
  }
}
