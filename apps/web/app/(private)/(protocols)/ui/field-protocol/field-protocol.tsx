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
import { Protocol } from "@/Protocols"
import { ProtocolSelector } from "@/Protocols/ui/protocol-selector/protocol-selector"

export interface FieldProtocolProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  form: UseFormReturn<TFieldValues>
  path: FieldPath<TFieldValues>
  label: string
  onChange?: (value: Protocol | null) => void
  description?: string
  required?: boolean
}

/**
 * Поле формы Protocol
 * @param props
 * @constructor
 */
function FieldProtocolInner<TFieldValues extends FieldValues>(
  props: FieldProtocolProps<TFieldValues>
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
          <ProtocolSelector
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

export const FieldProtocol = memo(FieldProtocolInner) as <
  TFieldValues extends FieldValues,
>(
  props: FieldProtocolProps<TFieldValues>
) => ReturnType<React.FC<FieldProtocolProps<TFieldValues>>>
