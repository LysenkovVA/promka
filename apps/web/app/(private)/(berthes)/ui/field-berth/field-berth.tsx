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
import { Berth } from "@/Berthes"
import { BerthSelector } from "../berth-selector/berth-selector"

export interface FieldBerthProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  form: UseFormReturn<TFieldValues>
  path: FieldPath<TFieldValues>
  label: string
  onChange?: (value: Berth | null) => void
  description?: string
  required?: boolean
}

/**
 * Поле формы BerthType
 * @param props
 * @constructor
 */
function FieldBerthInner<TFieldValues extends FieldValues>(
  props: FieldBerthProps<TFieldValues>
) {
  const { form, path, label, onChange, description, required = false } = props

  return (
    <Controller
      control={form.control}
      name={path}
      render={({ field, fieldState }) => (
        <Field aria-invalid={fieldState.invalid} className={"w-fit"}>
          <FieldLabel>
            <div className={"flex w-full items-center justify-start gap-1"}>
              {label}
              {required && (
                <IconAsterisk className={"size-2 text-destructive"} />
              )}
            </div>
          </FieldLabel>
          <BerthSelector
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

export const FieldBerth = memo(FieldBerthInner) as <
  TFieldValues extends FieldValues,
>(
  props: FieldBerthProps<TFieldValues>
) => ReturnType<React.FC<FieldBerthProps<TFieldValues>>>
