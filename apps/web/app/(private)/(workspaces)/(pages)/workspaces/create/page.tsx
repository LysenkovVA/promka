"use client"

import { DynamicModuleLoader } from "@/lib/redux"
import { DetailsWrapper } from "@/components/details-wrapper/details-wrapper"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import { workspaceDetailsReducer } from "../../../model/slice/workspace-details-slice"
import { WorkspaceDetailsForm } from "../../../ui/workspace-details-form/workspace-details-form"

export default function CreateWorkspacePage() {
  const router = useRouter()
  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <DynamicModuleLoader
      reducers={{ workspaceDetailsSchema: workspaceDetailsReducer }}
      removeAfterUnmount={true}
    >
      <DetailsWrapper
        isEdit={true}
        onBackClick={() => router.back()}
        onSaveClick={() => {
          hiddenSubmitInputRef.current?.click()
        }}
        title={"Новая компания"}
      >
        <WorkspaceDetailsForm
          submitRef={hiddenSubmitInputRef}
          onSubmit={() => router.back()}
          workspaceId={undefined}
        />
      </DetailsWrapper>
    </DynamicModuleLoader>
  )
}
