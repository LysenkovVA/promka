"use client"

import { memo, ReactNode } from "react"
import { FieldPath, FieldValues, useFormContext } from "react-hook-form"
import { SpecializationSelector } from "../specialization-selector/specialization-selector"
import { FormControl } from "@/components/form/form-control/form-control"

export interface FieldSpecializationProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  name: FieldPath<TFieldValues>
  label?: string
  required?: boolean
  placeholder?: string
  description?: ReactNode
}

export const FieldSpecialization = memo((props: FieldSpecializationProps) => {
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
        <SpecializationSelector
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
