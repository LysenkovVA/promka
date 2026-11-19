"use client"

import { memo } from "react"
import { Study } from "@/Studies/model/types/study.schema"
import { CertificateHelper } from "@/Certificates"
import { ProtocolHelper } from "@/Protocols"
import { StudyCard } from "../study-card/study-card"

export interface StudyCardListProps {
  studies?: Study[]
  hideEmployeeInfo?: boolean
}

export const StudyCardList = memo((props: StudyCardListProps) => {
  const { studies, hideEmployeeInfo = false } = props

  return (
    <div className="grid w-full grid-cols-3 gap-3">
      {studies?.map((study) => [
        ...(study.certificates?.map((certificate) => (
          <StudyCard
            key={certificate.id}
            type={"CERTIFICATE"}
            documentNumber={CertificateHelper.getNumberAndDate(certificate)}
            studyOrganization={
              study?.protocol?.studyOrganization?.id
                ? study?.protocol?.studyOrganization.name
                : (study?.workspace?.company?.name ?? "ХЗ")
            }
            specialization={study.specialization}
            employee={!hideEmployeeInfo ? certificate.employee : undefined}
          />
        )) ?? []),
        ...(study.employees?.map((employee) => (
          <StudyCard
            key={employee.id}
            type={"PROTOCOL"}
            documentNumber={ProtocolHelper.getNumberAndDate(study.protocol)}
            studyOrganization={
              study?.protocol?.studyOrganization?.id
                ? study?.protocol?.studyOrganization.name
                : (study?.workspace?.company?.name ?? "ХЗ")
            }
            specialization={study.specialization}
            employee={!hideEmployeeInfo ? employee : undefined}
          />
        )) ?? []),
      ])}
    </div>
  )
})
