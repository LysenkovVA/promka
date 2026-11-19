"use client"

import { memo, ReactNode } from "react"
import { FieldPath, FieldValues, useFormContext } from "react-hook-form"
import { StudyOrganizationSelector } from "../study-organization-selector/study-organization-selector"
import { FormControl } from "@/components/form/form-control/form-control"

export interface FieldStudyOrganizationProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  name: FieldPath<TFieldValues>
  label?: string
  required?: boolean
  placeholder?: string
  description?: ReactNode
}

/**
 * Поле формы StudyOrganization
 * @param props
 * @constructor
 */
function FieldStudyOrganizationInner<TFieldValues extends FieldValues>(
  props: FieldStudyOrganizationProps<TFieldValues>
) {
  const { name, label, required = false, placeholder, description } = props

  const { getFieldState } = useFormContext()

  return (
    <FormControl
      name={name}
      label={label}
      required={required}
      description={description}
    >
      {({ value, onChange, onBlur }) => (
        <StudyOrganizationSelector
          placeholder={placeholder}
          value={value ?? null}
          onChange={(e) => {
            if (!e) {
              onChange({})
            } else {
              onChange(e)
            }
          }}
          isInvalid={getFieldState(name)?.invalid}
        />
      )}
    </FormControl>
  )
}

export const FieldStudyOrganization = memo(FieldStudyOrganizationInner) as <
  TFieldValues extends FieldValues,
>(
  props: FieldStudyOrganizationProps<TFieldValues>
) => ReturnType<React.FC<FieldStudyOrganizationProps<TFieldValues>>>
