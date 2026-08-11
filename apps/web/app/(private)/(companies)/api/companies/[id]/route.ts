"use server"

import { NextRequest, NextResponse } from "next/server"
import { ResponseData } from "@/lib/responses/ResponseData"
import { ICompanyEntity } from "@/app/(private)/(companies)"
import { getCompanyById } from "@/app/(private)/(companies)/api/companies/[id]/actions/get-company-by-id"
import { deleteCompanyById } from "@/app/(private)/(companies)/api/companies/[id]/actions/delete-company-by-id"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<ICompanyEntity | undefined>>> {
  try {
    const { id } = await props.params
    return (await getCompanyById(id)).toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData<ICompanyEntity | undefined>>> {
  try {
    const { id } = await props.params

    return (await deleteCompanyById(id)).toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
