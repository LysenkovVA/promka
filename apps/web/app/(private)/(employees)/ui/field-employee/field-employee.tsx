"use client"

import { memo, ReactNode } from "react"
import { FieldPath, FieldValues, useFormContext } from "react-hook-form"
import { EmployeeSelector } from "../employee-selector/employee-selector"
import { FormControl } from "@/components/form/form-control/form-control"

export interface FieldEmployeeProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  name: FieldPath<TFieldValues>
  label?: string
  required?: boolean
  placeholder?: string
  description?: ReactNode
}

/**
 * Поле формы Employee
 * @param props
 * @constructor
 */
export const FieldEmployee = memo((props: FieldEmployeeProps) => {
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
        <EmployeeSelector
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
