"use client"

import React, { memo } from "react"
import { Certificate } from "../../model/types/certificate.schema"
import { cn } from "@workspace/ui/lib/utils"
import { CertificateHelper } from "@/Certificates/model/helpers/certificate-helper"
import { Avatar } from "@workspace/ui/components/avatar"
import { EmployeeHelper } from "@/Employees/helpers/employee-helper"
import { Separator } from "@workspace/ui/components/separator"
import { IconAlertTriangle } from "@tabler/icons-react"

export interface CertificateCardProps {
  className?: string
  certificate: Certificate
  onClick?: () => void
  hideEmployee?: boolean
  hideProtocol?: boolean
}

export const CertificateCard = memo((props: CertificateCardProps) => {
  const {
    className,
    certificate,
    onClick,
    hideEmployee = false,
    hideProtocol = false,
  } = props

  return (
    <div
      className={cn([
        `flex min-h-28 w-full flex-col items-center justify-center gap-0 rounded-lg border p-2 ${onClick ? "cursor-pointer" : "cursor-default"} ${CertificateHelper.bgColor(certificate)}`,
        className,
      ])}
      onClick={onClick}
    >
      <div className={"w-full text-center text-lg font-bold"}>
        {certificate.certificateType.name}
      </div>
      {certificate.certificateType.hasGroups && (
        <div className={"w-full text-center text-sm"}>
          {`гр. ${certificate.group}`}
        </div>
      )}
      <div className={"mt-2 w-full text-center text-xs font-light"}>
        {CertificateHelper.getNumberAndDate(certificate)}
      </div>
      <div
        className={
          "mt-2 w-full text-center text-xs font-bold text-muted-foreground"
        }
      >
        {`${CertificateHelper.getEstimatedTimeString(certificate)}`}
      </div>
      {!hideProtocol && !certificate?.protocol?.id && (
        <div
          className={
            "mt-2 flex items-center justify-center gap-1 text-xs text-destructive"
          }
        >
          <IconAlertTriangle className={"size-4"} />
          <div>{"Нет сведений о протоколе"}</div>
        </div>
      )}
      {!hideEmployee && certificate?.employee?.id && (
        <>
          <Separator className={"mt-2 mb-2"} />
          <div className={"flex flex-row items-center justify-center gap-2"}>
            <Avatar style={{ width: 40, height: 40 }} />
            <div className={"flex flex-col items-start justify-center gap-0"}>
              <div className={"text-sm"}>
                {EmployeeHelper.getFullName(certificate?.employee)}
              </div>
              <div className={"text-xs text-muted-foreground"}>
                {certificate?.employee.berth?.name}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
})
