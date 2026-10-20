"use client"

import { DetailsWrapper } from "@/components/details-wrapper/details-wrapper"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import { CertificatesListForm } from "../../../../../ui/certificates-list-form/certificates-list-form"

export default function CreateCertificatesPage() {
  const router = useRouter()
  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <DetailsWrapper
      isEdit={true}
      onBackClick={() => router.back()}
      onSaveClick={() => {
        hiddenSubmitInputRef.current?.click()
      }}
    >
      <CertificatesListForm submitRef={hiddenSubmitInputRef} />
    </DetailsWrapper>
  )
}
