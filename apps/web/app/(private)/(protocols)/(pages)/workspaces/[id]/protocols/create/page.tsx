"use client"

import { DynamicModuleLoader } from "@/lib/redux"
import { protocolDetailsReducer } from "@/Protocols/model/slice/protocol-details.slice"
import { DetailsWrapper } from "@/components/details-wrapper/details-wrapper"
import { useRouter } from "next/navigation"
import { ProtocolDetailsForm } from "../../../../../ui/protocol-details-form/protocol-details-form"
import { useRef } from "react"

export default function CreateProtocolPage() {
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
        title={"Новый протокол"}
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
