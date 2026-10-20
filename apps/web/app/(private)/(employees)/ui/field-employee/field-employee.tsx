"use client"

import { memo } from "react"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  Controller,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form"
import { IconAsterisk } from "@tabler/icons-react"
import { Employee } from "@/Employees"
import { EmployeeSelector } from "@/Employees/ui/employee-selector/employee-selector"

export interface FieldEmployeeProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  form: UseFormReturn<TFieldValues>
  path: FieldPath<TFieldValues>
  label: string
  onChange?: (value: Employee | null) => void
  description?: string
  required?: boolean
}

/**
 * Поле формы Employee
 * @param props
 * @constructor
 */
function FieldEmployeeInner<TFieldValues extends FieldValues>(
  props: FieldEmployeeProps<TFieldValues>
) {
  const { form, path, label, onChange, description, required = false } = props

  return (
    <Controller
      control={form.control}
      name={path}
      render={({ field, fieldState }) => (
        <Field aria-invalid={fieldState.invalid} className={"w-full"}>
          <FieldLabel>
            <div className={"flex w-full items-center justify-start gap-1"}>
              {label}
              {required && (
                <IconAsterisk className={"size-2 text-destructive"} />
              )}
            </div>
          </FieldLabel>
          <EmployeeSelector
            value={field.value ?? null}
            onChange={(e) => {
              field.onChange(e)
              onChange?.(e)
            }}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export const FieldEmployee = memo(FieldEmployeeInner) as <
  TFieldValues extends FieldValues,
>(
  props: FieldEmployeeProps<TFieldValues>
) => ReturnType<React.FC<FieldEmployeeProps<TFieldValues>>>
