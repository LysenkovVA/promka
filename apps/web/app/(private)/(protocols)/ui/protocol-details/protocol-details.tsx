"use client"

import React, { memo, useCallback, useEffect, useRef, useState } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { protocolDetailsReducer } from "../../model/slice/protocol-details.slice"
import {
  getProtocolDetailsData,
  getProtocolDetailsError,
  getProtocolDetailsIsFetching,
  getProtocolDetailsIsInitialized,
} from "../../model/selectors/protocol-details.selectors"
import { deleteProtocolThunk } from "../../model/thunks/delete-protocol.thunk"
import { useAuth } from "@/app/(public)/(auth)"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ProtocolDetailsForm } from "../protocol-details-form/protocol-details-form"
import { DetailsWrapper } from "@/components/details-wrapper/details-wrapper"
import { getProtocolByIdThunk } from "../../model/thunks/get-protocol-by-id.thunk"
import { FieldDescription } from "@workspace/ui/components/field"
import { Separator } from "@workspace/ui/components/separator"
import { CertificateCard } from "@/Certificates"
import { ProtocolHelper } from "../../model/helpers/protocol-helper"
import { IconAlertTriangle } from "@tabler/icons-react"

export interface ProtocolDetailsProps {
  protocolId?: string
}

export const ProtocolDetails = memo((props: ProtocolDetailsProps) => {
  const { protocolId } = props

  const [isEdit, setIsEdit] = useState(false)

  const dispatch = useAppDispatch()
  const data = useAppSelector(getProtocolDetailsData)
  const error = useAppSelector(getProtocolDetailsError)
  const isInitialized = useAppSelector(getProtocolDetailsIsInitialized)
  const isLoading = useAppSelector(getProtocolDetailsIsFetching)

  const auth = useAuth()
  const router = useRouter()

  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (protocolId && !isInitialized && !isLoading) {
      dispatch(getProtocolByIdThunk({ protocolId: protocolId }))
    }
  }, [dispatch, protocolId, isInitialized, isLoading])

  const onDeleteCallback = useCallback(async () => {
    try {
      if (auth.activeWorkspace.id && protocolId) {
        const result = await dispatch(
          deleteProtocolThunk({
            protocolId: protocolId,
            workspaceId: auth.activeWorkspace.id,
          })
        ).unwrap()

        if (result.isOk) {
          toast.success(
            `Протокл '${ProtocolHelper.getNumberAndDate(data)}' удалён`,
            {
              position: "top-center",
              style: {
                color: "green",
              },
            }
          )
          router.back()
        }
      }
    } catch (error) {
      toast.error((error as string) ?? "Ошибка", {
        position: "top-center",
        style: { color: "tomato" },
      })
    }
  }, [auth?.activeWorkspace?.id, data, dispatch, protocolId, router])

  return (
    <DynamicModuleLoader
      reducers={{ protocolDetailsSchema: protocolDetailsReducer }}
      removeAfterUnmount={true}
    >
      <DetailsWrapper
        error={error}
        isEdit={isEdit}
        onEditClick={() => setIsEdit(true)}
        onSaveClick={() => {
          hiddenSubmitInputRef.current?.click()
        }}
        onBackClick={() => {
          if (isEdit) {
            setIsEdit(false)
          } else {
            router.back()
          }
        }}
        deleteMessage={`Вы действительно хотите удалить "${ProtocolHelper.getNumberAndDate(data)}"`}
        onDeleteClick={onDeleteCallback}
        title={protocolId ? "Протокол" : "Новый протокол"}
      >
        {isEdit ? (
          <ProtocolDetailsForm
            onSubmit={() => {
              setIsEdit(false)
            }}
            submitRef={hiddenSubmitInputRef}
            protocolId={protocolId}
          />
        ) : (
          <div
            className={"flex w-full flex-col items-start justify-start gap-3"}
          >
            <div style={{ fontSize: 26, fontWeight: "bold" }}>
              {ProtocolHelper.getNumberAndDate(data)}
            </div>
            {(!data?.certificates || data?.certificates?.length === 0) && (
              <div
                className={
                  "flex items-center justify-center gap-2 text-destructive"
                }
              >
                <IconAlertTriangle />
                <div>{"Удостоверений нет"}</div>
              </div>
            )}
            {data?.id && data.certificates && data.certificates.length > 0 && (
              <>
                <FieldDescription className={"mt-4"}>
                  {"Удостоверения"}
                </FieldDescription>
                <Separator />
                <div className={"grid w-full grid-cols-3 gap-2"}>
                  {data.certificates?.map((item) => (
                    <CertificateCard
                      key={item.id}
                      certificate={item}
                      hideEmployee={false}
                      hideProtocol={true}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </DetailsWrapper>
    </DynamicModuleLoader>
  )
})
