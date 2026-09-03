"use client"

import { memo, useCallback, useEffect, useState } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { employeeDetailsReducer } from "@/Employees/model/slice/employee-details.slice"
import { Avatar } from "@workspace/ui/components/avatar"
import {
  getEmployeeDetailsData,
  getEmployeeDetailsError,
} from "@/Employees/model/selectors/employee-details.selectors"
import { getEmployeeByIdThunk } from "@/Employees/model/thunks/get-employee-by-id.thunk"
import { DetailsHeader } from "@/components/details-header/details-header"
import { EditEmployeeSheet } from "@/Employees"
import { deleteEmployeeThunk } from "@/Employees/model/thunks/delete-employee.thunk"
import { useAuth } from "@/app/(public)/(auth)"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export interface EmployeeDetailsProps {
  employeeId?: string
}

export const EmployeeDetails = memo((props: EmployeeDetailsProps) => {
  const { employeeId } = props

  const dispatch = useAppDispatch()
  const data = useAppSelector(getEmployeeDetailsData)
  const error = useAppSelector(getEmployeeDetailsError)

  const [editSheetIsOpen, setEditSheetIsOpen] = useState(false)

  const auth = useAuth()

  const router = useRouter()

  useEffect(() => {
    if (employeeId) dispatch(getEmployeeByIdThunk({ employeeId: employeeId }))
  }, [dispatch, employeeId])

  const onDeleteCallback = useCallback(async () => {
    try {
      if (auth.activeWorkspace.id && employeeId) {
        const result = await dispatch(
          deleteEmployeeThunk({
            employeeId: employeeId,
            workspaceId: auth.activeWorkspace.id,
          })
        )

        if (result.meta.requestStatus === "fulfilled") {
          toast.success(`Сотрудник '${data?.surname}' удалён`, {
            position: "top-center",
          })
          router.back()
        } else {
          toast.error(JSON.stringify(result.payload))
        }
      }
    } catch (e) {
      toast.error(JSON.stringify(e))
    }
  }, [auth.activeWorkspace.id, data?.surname, dispatch, employeeId, router])

  return (
    <DynamicModuleLoader
      reducers={{ employeeDetailsSchema: employeeDetailsReducer }}
      removeAfterUnmount={true}
    >
      <div className={"flex w-full flex-col gap-4"}>
        <DetailsHeader
          onEditClick={() => setEditSheetIsOpen(true)}
          onDeleteClick={onDeleteCallback}
          deleteMessage={`Вы действительно хотите удалить '${data?.surname}' со всеми связанными данными?`}
        >
          <EditEmployeeSheet
            isOpen={editSheetIsOpen}
            handleOpenChange={(e) => setEditSheetIsOpen(e)}
            employeeId={employeeId}
          />
        </DetailsHeader>
        <div className={"flex w-full flex-col items-start justify-start gap-3"}>
          {error && <div>{error}</div>}
          <div
            className={"flex w-full flex-row items-center justify-center gap-4"}
          >
            <Avatar style={{ width: 100, height: 100 }} />
            <div
              className={
                "flex w-full flex-col items-start justify-center gap-1"
              }
            >
              <div style={{ fontSize: 30, fontWeight: "bold" }}>
                {data?.surname}
              </div>
              <div style={{ fontSize: 20 }}>{data?.name}</div>
            </div>
          </div>
        </div>
      </div>
    </DynamicModuleLoader>
  )
})
