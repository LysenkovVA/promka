"use client"

import { memo, useCallback } from "react"
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
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

export interface FieldDurationProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  form: UseFormReturn<TFieldValues>
  path: FieldPath<TFieldValues>
  label: string
  placeholder?: string
  onChange?: (value: number) => void
  description?: string
  required?: boolean
}

/**
 * Поле формы Input
 * @param props
 * @constructor
 */
function FieldDurationInner<TFieldValues extends FieldValues>(
  props: FieldDurationProps<TFieldValues>
) {
  const {
    form,
    path,
    label,
    placeholder,
    onChange,
    description,
    required = false,
  } = props

  const getTabValue = useCallback((value: number) => {
    switch (value) {
      case 0:
        return "0"
      case 12:
        return "12"
      case 36:
        return "36"
      case 60:
        return "60"
    }

    return "own"
  }, [])

  return (
    <Controller
      control={form.control}
      name={path}
      render={({ field, fieldState }) => (
        <Field aria-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={`${path}`}>
            <div className={"flex w-full items-center justify-start gap-1"}>
              {label}
              {required && (
                <IconAsterisk className={"size-2 text-destructive"} />
              )}
            </div>
          </FieldLabel>
          <Tabs defaultValue={"0"} value={getTabValue(field.value)}>
            <TabsList>
              <TabsTrigger
                value="0"
                onClick={() => {
                  field.onChange(0)
                  onChange?.(0)
                }}
              >
                Бессрочное
              </TabsTrigger>
              <TabsTrigger
                value="12"
                onClick={() => {
                  field.onChange(12)
                  onChange?.(12)
                }}
              >
                1 год
              </TabsTrigger>
              <TabsTrigger
                value="36"
                onClick={() => {
                  field.onChange(36)
                  onChange?.(36)
                }}
              >
                3 года
              </TabsTrigger>
              <TabsTrigger
                value="60"
                onClick={() => {
                  field.onChange(60)
                  onChange?.(60)
                }}
              >
                5 лет
              </TabsTrigger>
              {/*<TabsTrigger value="own">Своё</TabsTrigger>*/}
            </TabsList>
            {/*<TabsContent value="own">*/}
            {/*  <Input*/}
            {/*    // aria-invalid={fieldState.invalid}*/}
            {/*    autoComplete={"off"}*/}
            {/*    placeholder={placeholder}*/}
            {/*    value={field.value ?? 1}*/}
            {/*    onChange={(e) => {*/}
            {/*      field.onChange(e)*/}
            {/*      onChange?.(Number(e.target.value))*/}
            {/*    }}*/}
            {/*  />*/}
            {/*</TabsContent>*/}
          </Tabs>

          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export const FieldDuration = memo(FieldDurationInner) as <
  TFieldValues extends FieldValues,
>(
  props: FieldDurationProps<TFieldValues>
) => ReturnType<React.FC<FieldDurationProps<TFieldValues>>>
