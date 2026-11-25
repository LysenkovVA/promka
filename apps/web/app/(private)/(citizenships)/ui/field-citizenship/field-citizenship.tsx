"use client"

import { memo, ReactNode } from "react"
import { FieldPath, FieldValues, useFormContext } from "react-hook-form"
import { CitizenshipSelector } from "../citizenship-selector/citizenship-selector"
import { FormControl } from "@/components/form/form-control/form-control"

export interface FieldCitizenshipProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  name: FieldPath<TFieldValues>
  label?: string
  required?: boolean
  placeholder?: string
  description?: ReactNode
}

/**
 * Поле формы Citizenship
 * @param props
 * @constructor
 */
export const FieldCitizenship = memo((props: FieldCitizenshipProps) => {
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
        <CitizenshipSelector
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
})
