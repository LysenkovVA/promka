"use client"

import { memo } from "react"
import { Certificate } from "../../model/types/certificate.schema"
import { cn } from "@workspace/ui/lib/utils"
import { CertificateHelper } from "@/Certificates/model/helpers/certificate-helper"

export interface CertificateCardProps {
  className?: string
  certificate: Certificate
  onClick?: () => void
}

export const CertificateCard = memo((props: CertificateCardProps) => {
  const { className, certificate, onClick } = props

  // const bgColor: string = useMemo(() => {
  //   if (certificate.certificateType.durationAtMonths === 0)
  //     return "bg-green-100"
  //
  //   return "bg-yellow-200"
  // }, [certificate.certificateType.durationAtMonths])

  return (
    <div
      className={cn([
        `flex min-h-28 w-full flex-col items-center justify-center gap-0 rounded-lg border p-2 ${onClick ? "cursor-pointer" : "cursor-default"} ${CertificateHelper.bgColor(certificate)}`,
        className,
      ])}
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
    </div>
  )
})
