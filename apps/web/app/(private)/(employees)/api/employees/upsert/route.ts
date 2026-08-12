"use server"

import { NextRequest, NextResponse } from "next/server"
import { upsertEmployee } from "./actions/upsert-employee"
import { ResponseData } from "@/lib/responses/ResponseData"
import { IEmployeeEntity } from "../../../model/types/IEmployeeEntity"

export async function POST(
  request: NextRequest
): Promise<NextResponse<ResponseData<IEmployeeEntity | undefined>>> {
  try {
    const workspaceId = request.nextUrl.searchParams.get("workspaceId")

    if (!workspaceId) {
      throw new Error("В запросе не обнаружен workspaceId")
    }

    const formData = await request.formData()
    const entityToSave = JSON.parse(formData.get("entity-data") as string)

    const upsertedData = await upsertEmployee(entityToSave, workspaceId)

    return upsertedData.toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
