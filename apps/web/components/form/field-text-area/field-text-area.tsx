"use client"

import { memo, ReactNode } from "react"
import { FieldPath, FieldValues, useFormContext } from "react-hook-form"
import { FormControl } from "@/components/form/form-control/form-control"
import { Textarea } from "@workspace/ui/components/textarea"

export interface FieldTextAreaProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  name: FieldPath<TFieldValues>
  label?: string
  required?: boolean
  placeholder?: string
  description?: ReactNode
}

/**
 * Текстовое поле формы
 */
export const FieldTextArea = memo((props: FieldTextAreaProps) => {
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
        <Textarea
          aria-invalid={getFieldState(name)?.invalid}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
        />
      )}
    </FormControl>
  )
})
