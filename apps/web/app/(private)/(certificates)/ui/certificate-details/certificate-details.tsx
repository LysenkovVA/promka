"use client"

import React, { memo, useCallback, useEffect, useRef, useState } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { certificateDetailsReducer } from "../../model/slice/certificate-details.slice"
import {
  getCertificateDetailsData,
  getCertificateDetailsError,
  getCertificateDetailsIsFetching,
  getCertificateDetailsIsInitialized,
} from "../../model/selectors/certificate-details.selectors"
import { deleteCertificateThunk } from "../../model/thunks/delete-certificate.thunk"
import { useAuth } from "@/app/(public)/(auth)"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CertificateDetailsForm } from "../certificate-details-form/certificate-details-form"
import { DetailsWrapper } from "@/components/details-wrapper/details-wrapper"
import { getCertificateByIdThunk } from "../../model/thunks/get-certificate-by-id.thunk"
import { CertificateHelper } from "../../model/helpers/certificate-helper"
import { EmployeeHelper } from "@/Employees"
import { ProtocolHelper } from "@/Protocols"
import { Avatar } from "@workspace/ui/components/avatar"
import { IconAlertTriangle } from "@tabler/icons-react"

export interface CertificateDetailsProps {
  certificateId?: string
}

export const CertificateDetails = memo((props: CertificateDetailsProps) => {
  const { certificateId } = props

  const [isEdit, setIsEdit] = useState(false)

  const dispatch = useAppDispatch()
  const data = useAppSelector(getCertificateDetailsData)
  const error = useAppSelector(getCertificateDetailsError)
  const isInitialized = useAppSelector(getCertificateDetailsIsInitialized)
  const isLoading = useAppSelector(getCertificateDetailsIsFetching)

  const auth = useAuth()
  const router = useRouter()

  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (certificateId && !isInitialized && !isLoading) {
      dispatch(getCertificateByIdThunk({ certificateId: certificateId }))
    }
  }, [dispatch, certificateId, isInitialized, isLoading])

  const onDeleteCallback = useCallback(async () => {
    try {
      if (auth.activeWorkspace.id && certificateId) {
        const result = await dispatch(
          deleteCertificateThunk({
            certificateId: certificateId,
            workspaceId: auth.activeWorkspace.id,
          })
        ).unwrap()

        if (result.isOk) {
          toast.success(
            `Удостоверение '${CertificateHelper.getNumberAndDate(data)}' удалено`,
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
  }, [auth?.activeWorkspace?.id, certificateId, dispatch, data, router])

  return (
    <DynamicModuleLoader
      reducers={{ certificateDetailsSchema: certificateDetailsReducer }}
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
        deleteMessage={`Вы действительно хотите удалить "${CertificateHelper.getNumberAndDate(data)}"`}
        onDeleteClick={onDeleteCallback}
        title={"Удостоверение"}
      >
        {isEdit ? (
          <CertificateDetailsForm
            onSubmit={() => {
              setIsEdit(false)
            }}
            submitRef={hiddenSubmitInputRef}
            certificateId={certificateId}
          />
        ) : (
          <div
            className={"flex w-full flex-col items-start justify-start gap-3"}
          >
            <div className={"rounded-lg border p-2 text-sm"}>
              {data?.certificateType.name}
            </div>
            <div style={{ fontSize: 26, fontWeight: "bold" }}>
              {CertificateHelper.getNumberAndDate(data)}
            </div>
            {!data?.protocol?.id ? (
              <div
                className={
                  "flex items-center justify-center gap-1 text-xs text-destructive"
                }
              >
                <IconAlertTriangle className={"size-4"} />
                <div>{"Нет сведений о протоколе"}</div>
              </div>
            ) : (
              <div>{`Протокол ${ProtocolHelper.getNumberAndDate(data?.protocol)}`}</div>
            )}
            <div className={"flex flex-row items-center justify-center gap-2"}>
              <Avatar style={{ width: 40, height: 40 }} />
              <div className={"flex flex-col items-start justify-center gap-0"}>
                <div className={"text-sm"}>
                  {EmployeeHelper.getFullName(data?.employee)}
                </div>
                <div className={"text-xs text-muted-foreground"}>
                  {data?.employee.berth?.name}
                </div>
              </div>
            </div>
          </div>
        )}
      </DetailsWrapper>
    </DynamicModuleLoader>
  )
})
