"use client"

import React, { memo } from "react"
import { Certificate } from "@/Certificates"
import { Separator } from "@workspace/ui/components/separator"
import { CertificateCard } from "@/Certificates/ui/certificate-card/certificate-card"
import { FieldDescription } from "@workspace/ui/components/field"

export interface CertificatesListProps {
  certificates: Certificate[] | null
}

export const CertificatesList = memo((props: CertificatesListProps) => {
  const { certificates } = props

  if (!certificates) return null

  return (
    <>
      <FieldDescription className={"mt-4"}>{"Удостоверения"}</FieldDescription>
      <Separator />
      <div className={"grid w-full grid-cols-3 gap-2"}>
        {!certificates && <div>{"Удостоверений нет"}</div>}
        {certificates?.map((item) => (
          <CertificateCard key={item.id} certificate={item} />
        ))}
      </div>
    </>
  )
})
