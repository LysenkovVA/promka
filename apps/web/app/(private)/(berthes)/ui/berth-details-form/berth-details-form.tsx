"use client"

import { memo } from "react"
import {
  Field,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { berthDetailsActions } from "@/Berthes/model/slice/berth-details.slice"
import { useAppDispatch, useAppSelector } from "@/lib/redux"
import {
  getBerthDetailsFormData,
  getBerthDetailsValidationErrors,
} from "@/Berthes/model/selectors/berth-details.selectors"
import { Badge } from "@workspace/ui/components/badge"

export interface BerthDetailsFormProps {}

export const BerthDetailsForm = memo((props: BerthDetailsFormProps) => {
  const {} = props

  const dispatch = useAppDispatch()
  const formData = useAppSelector(getBerthDetailsFormData)
  const validationErrors = useAppSelector(getBerthDetailsValidationErrors)

  return (
    <div className={"overflow-y no-scrollbar flex w-full flex-col gap-8 p-2"}>
      <FieldSet className={"w-full"}>
        {/*<Field data-invalid={!!validationErrors.name}>*/}
        <Field>
          <FieldLabel htmlFor="name">
            {"Название"}
            <Badge variant={"secondary"}>{"обязательно"}</Badge>
          </FieldLabel>
          <Input
            aria-invalid={!!validationErrors.name}
            id="name"
            value={formData?.name ?? ""}
            onChange={(e) =>
              dispatch(
                berthDetailsActions.setFormData({
                  data: { ...formData!, name: e.target.value },
                })
              )
            }
          />
          <FieldError
            className={"text-destructive"}
            errors={[{ message: validationErrors.name }]}
          />
        </Field>
      </FieldSet>
    </div>
  )
})
