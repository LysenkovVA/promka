"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { getEmployees } from "./actions/getEmployees"
import { IEmployeeEntity } from "../../../../../(employees)/model/types/IEmployeeEntity"

export async function GET(
  request: NextRequest
): Promise<NextResponse<ResponseData<IEmployeeEntity[] | undefined>>> {
  try {
    const workspaceId = request.nextUrl.searchParams.get("workspaceId")

    if (!workspaceId) {
      throw new Error("В запросе не обнаружен workspaceId")
    }

    return (await getEmployees(workspaceId)).toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
