import { Metadata } from "next"
import { EmployeeDetails } from "../../../../../ui/employee-details/employee-details"

export const metadata: Metadata = {
  title: "Сотрудник",
}

export default async function EmployeeDetailsPage({
  params,
}: {
  params: Promise<{ "employee-id": string }>
}) {
  const { "employee-id": employeeId } = await params

  return (
    <>
      {/*{JSON.stringify(await params)*/}
      <EmployeeDetails employeeId={employeeId} />
    </>
  )
}
