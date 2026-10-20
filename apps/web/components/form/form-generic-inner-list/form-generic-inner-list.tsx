import React from "react"
import {
  ArrayPath,
  Control,
  FieldArrayWithId,
  FieldValues,
  FormState,
  Path,
  useFieldArray,
  UseFormRegister,
} from "react-hook-form"

interface GenericInnerListProps<TFieldValues extends FieldValues> {
  name: ArrayPath<TFieldValues> // string
  // Связываем Control с типом TFieldValues родительской формы
  control: Control<TFieldValues, any, TFieldValues>
  register: UseFormRegister<any>
  formState: FormState<TFieldValues>
  renderItems: (
    fields: FieldArrayWithId<any, string, "id">[],
    methods: {
      append: (value: any) => void
      remove: (index: number) => void
      getPath: (index: number, subKey: string) => Path<TFieldValues>
      errors: any
    }
  ) => React.ReactNode
}

export function GenericInnerList<TFieldValues extends FieldValues>({
  name,
  control,
  register,
  formState,
  renderItems,
}: GenericInnerListProps<TFieldValues>) {
  // Приводим control к any только внутри самого хука useFieldArray,
  // чтобы RHF не ругался на динамическое имя массива (string)
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: name,
  })

  const getNestedErrors = (path: string) => {
    return path
      .split(".")
      .reduce((obj, key) => obj?.[key], formState.errors as any)
  }

  const errors = getNestedErrors(name)

  const getPath = (index: number, subKey: string) => {
    return `${name}.${index}.${subKey}` as Path<TFieldValues>
  }

  return <>{renderItems(fields, { append, remove, getPath, errors })}</>
}
