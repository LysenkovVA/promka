"use client"

import { DynamicModuleLoader } from "@/lib/redux"
import { DetailsWrapper } from "@/components/details-wrapper/details-wrapper"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import { protocolDetailsReducer } from "../../../../../../(protocols)/model/slice/protocol-details.slice"
import { ProtocolDetailsForm } from "../../../../../../(protocols)/ui/protocol-details-form/protocol-details-form"

export default function CreateStudyPage() {
  const router = useRouter()
  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <DynamicModuleLoader
      reducers={{ protocolDetailsSchema: protocolDetailsReducer }}
      removeAfterUnmount={true}
    >
      <DetailsWrapper
        isEdit={true}
        onBackClick={() => router.back()}
        onSaveClick={() => {
          hiddenSubmitInputRef.current?.click()
        }}
        title={"Новое обучение"}
      >
        <ProtocolDetailsForm
          submitRef={hiddenSubmitInputRef}
          onSubmit={() => router.back()}
          protocolId={undefined}
        />
      </DetailsWrapper>
    </DynamicModuleLoader>
  )
}
