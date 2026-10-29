"use client"

import { DynamicModuleLoader } from "@/lib/redux"
import { DetailsWrapper } from "@/components/details-wrapper/details-wrapper"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import { certificateDetailsReducer } from "../../../../../model/slice/certificate-details.slice"
import { CertificateDetailsForm } from "../../../../../ui/certificate-details-form/certificate-details-form"

export default function CreateCertificatePage() {
  const router = useRouter()
  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <DynamicModuleLoader
      reducers={{ certificateDetailsSchema: certificateDetailsReducer }}
      removeAfterUnmount={true}
    >
      <DetailsWrapper
        isEdit={true}
        onBackClick={() => router.back()}
        onSaveClick={() => {
          hiddenSubmitInputRef.current?.click()
        }}
        title={"Новое удостоверение"}
      >
        <CertificateDetailsForm
          submitRef={hiddenSubmitInputRef}
          onSubmit={() => router.back()}
          certificateId={undefined}
        />
      </DetailsWrapper>
    </DynamicModuleLoader>
  )
}
