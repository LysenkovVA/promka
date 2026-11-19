"use client"

import { memo } from "react"
import { Specialization, SpecializationHelper } from "@/Specializations"
import { Avatar } from "@workspace/ui/components/avatar"
import { Employee, EmployeeHelper } from "@/Employees"

export interface StudyCardProps {
  type: "CERTIFICATE" | "PROTOCOL"
  documentNumber: string
  studyOrganization: string
  specialization: Specialization
  employee?: Employee
}

export const StudyCard = memo((props: StudyCardProps) => {
  const { type, documentNumber, studyOrganization, specialization, employee } =
    props

  return (
    <div
      className={`flex flex-col items-center justify-center gap-0 rounded-lg border p-2 ${SpecializationHelper.bgColor(specialization, new Date())}`}
    >
      <div className={"flex items-center justify-center gap-1"}>
        <div className={"rounded-lg border bg-muted p-1 text-xs"}>
          {type === "CERTIFICATE"
            ? "Удостоверение".toLowerCase()
            : "Протокол".toLowerCase()}
        </div>
        <div className={"rounded-lg border bg-muted p-1 text-xs"}>
          {documentNumber}
        </div>
        <div className={"rounded-lg border bg-muted p-1 text-xs"}>
          {SpecializationHelper.getDurationString(specialization)}
        </div>
      </div>
      <div className={"text-xs"}>{studyOrganization}</div>
      <div className={"mt-2 flex items-center justify-center gap-1"}>
        <div className={"text-lg font-bold"}>
          {specialization.specializationDirection.name}
        </div>
        {specialization.specializationParameter?.id && (
          <div className={"text-lg font-bold"}>
            {`(${SpecializationHelper.getParameter(
              specialization
            )})`.toLowerCase()}
          </div>
        )}
      </div>
      {employee?.id && (
        <div
          className={"mt-2 flex items-center justify-center gap-1 font-light"}
        >
          <Avatar size={"sm"} />
          {EmployeeHelper.getFullName(employee)}
        </div>
      )}
    </div>
  )
})
