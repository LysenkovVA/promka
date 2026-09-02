// "use server"
//
// import { NextRequest, NextResponse } from "next/server"
// import { ResponseData } from "@/lib/responses/ResponseData"
// import { IEmployeeEntity } from "../../../../../../(employees)/model/types/IEmployeeEntity"
// import { getEmployeeById } from "./actions/get-employee-by-id"
// import { deleteEmployeeById } from "./actions/delete-employee-by-id"
//
// export async function GET(
//   request: NextRequest,
//   props: { params: Promise<{ id: string }> }
// ): Promise<NextResponse<ResponseData<IEmployeeEntity | undefined>>> {
//   try {
//     const { id } = await props.params
//     return (await getEmployeeById(id)).toNextResponse()
//   } catch (error) {
//     return ResponseData.InternalServerError(error).toNextResponse()
//   }
// }
//
// export async function DELETE(
//   request: NextRequest,
//   props: { params: Promise<{ id: string }> }
// ): Promise<NextResponse<ResponseData<IEmployeeEntity | undefined>>> {
//   try {
//     const { id } = await props.params
//
//     return (await deleteEmployeeById(id)).toNextResponse()
//   } catch (error) {
//     return ResponseData.InternalServerError(error).toNextResponse()
//   }
// }
