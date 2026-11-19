"use client"

import { memo, ReactNode } from "react"
import { FieldPath, FieldValues, useFormContext } from "react-hook-form"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { ProtocolStudyLocation } from "@workspace/database/prisma/.generated/enums"
import { useAuth } from "@/app/(public)/(auth)"
import { FormControl } from "@/components/form/form-control/form-control"

export interface FieldStudyOrganizationProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  name: FieldPath<TFieldValues>
  label?: string
  required?: boolean
  description?: ReactNode
  disabled?: boolean
}

/**
 * Поле формы Input
 * @param props
 * @constructor
 */
function FieldStudyOrganizationInner<TFieldValues extends FieldValues>(
  props: FieldStudyOrganizationProps<TFieldValues>
) {
  const { name, label, required = false, description, disabled = false } = props

  const { getFieldState } = useFormContext()

  const auth = useAuth()

  return (
    <FormControl
      name={name}
      label={label}
      required={required}
      description={description}
    >
      {({ value, onChange, onBlur }) => (
        <Tabs
          aria-invalid={getFieldState(name)?.invalid}
          defaultValue={ProtocolStudyLocation.AT_COMPANY}
          value={value}
          onBlur={onBlur}
        >
          <TabsList>
            <TabsTrigger
              aria-invalid={getFieldState(name)?.invalid}
              disabled={disabled}
              value={ProtocolStudyLocation.AT_COMPANY}
              onClick={() => {
                onChange(ProtocolStudyLocation.AT_COMPANY)
              }}
              onBlur={onBlur}
            >
              {auth?.activeWorkspace?.company.name
                ? `В ${auth?.activeWorkspace?.company.name}`
                : "Текущая организация не определена"}
            </TabsTrigger>
            <TabsTrigger
              aria-invalid={getFieldState(name)?.invalid}
              disabled={disabled}
              value={ProtocolStudyLocation.AT_STUDY_ORGANIZATION}
              onClick={() => {
                onChange(ProtocolStudyLocation.AT_STUDY_ORGANIZATION)
              }}
              onBlur={onBlur}
            >
              {"В учебном центре"}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
    </FormControl>
  )
}

export const FieldStudyLocation = memo(FieldStudyOrganizationInner) as <
  TFieldValues extends FieldValues,
>(
  props: FieldStudyOrganizationProps<TFieldValues>
) => ReturnType<React.FC<FieldStudyOrganizationProps<TFieldValues>>>
