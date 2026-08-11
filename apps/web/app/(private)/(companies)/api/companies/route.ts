"use server"

import { NextRequest, NextResponse } from "next/server"
import { ICompanyEntity } from "@/app/(private)/(companies)"
import { ResponseData } from "@/lib/responses/ResponseData"
import { getCompanies } from "@/app/(private)/(companies)/api/companies/actions/getCompanies"
import { checkAuth } from "@/app/(auth)"

export async function GET(
  request: NextRequest
): Promise<NextResponse<ResponseData<ICompanyEntity[] | undefined>>> {
  try {
    await checkAuth()
    return (await getCompanies()).toNextResponse()
  } catch (error) {
    return ResponseData.InternalServerError(error).toNextResponse()
  }
}
