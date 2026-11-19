import React, { ReactNode } from "react"
import {
  FieldArrayWithId,
  get,
  useFieldArray,
  useFormContext,
} from "react-hook-form"
import {
  Field,
  FieldDescription,
  FieldTitle,
} from "@workspace/ui/components/field"
import { FormFieldError } from "@/components/form/form-field-error/form-field-error"
import { IconPlusFilled } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"

// Описываем методы, которые мы отдадим наружу в renderItems
interface RenderMethods {
  append: (value: any) => void
  remove: (index: number) => void
  // Функция для сборки пути к вложенному полю текущего элемента
  getItemPath: (index: number, subKey?: string) => string
  // Объект ошибок ИМЕННО для этого массива
  errors: any
}

interface FormCollectionProps {
  /** Полный путь к массиву в стейте формы (например, "groups" или "groups.0.students") */
  name: string
  /** Дефолтные значения для инициализации нового элемента при append */
  defaultRowValues: any
  listTitle?: ReactNode
  description?: ReactNode
  showAddButton: boolean
  addButtonTitle?: string
  /** Рендер-функция (Render Prop) */
  children: (
    fields: FieldArrayWithId<any, string, "id">[],
    methods: RenderMethods
  ) => React.ReactNode
}

export function FormCollection({
  name,
  defaultRowValues,
  listTitle,
  description,
  showAddButton,
  addButtonTitle,
  children,
}: FormCollectionProps) {
  // Забираем control и formState из контекста (он должен быть объявлен выше по дереву)
  const { control, formState, watch } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  // Получаем ошибки конкретно для этого уровня вложенности
  const errors = get(formState.errors, name)

  // Хелпер для генерации путей дочерних элементов
  const getItemPath = (index: number, subKey?: string) => {
    return subKey ? `${name}.${index}.${subKey}` : `${name}.${index}`
  }

  return (
    <Field className={"w-full"}>
      {listTitle && watch(name)?.length > 0 && (
        <FieldTitle className={"text-lg font-light text-muted-foreground"}>
          {listTitle}
        </FieldTitle>
      )}
      {description && (
        <FieldDescription className={"pr-1.5 pl-1.5 font-light"}>
          {description}
        </FieldDescription>
      )}
      {children(fields, { append, remove, getItemPath, errors })}
      {errors && errors.length > 0 && (
        <div
          className={"flex w-full flex-col items-center justify-center gap-2"}
        >
          {errors?.map(
            // @ts-ignore
            (error, index) =>
              error?.message && (
                <FormFieldError
                  key={index}
                  message={error?.message}
                  withBorder
                />
              )
          )}
        </div>
      )}
      {errors?.message && (
        <FormFieldError message={errors.message} withBorder />
      )}
      {showAddButton && (
        <div className={"mt-2 flex flex-col items-start justify-center gap-2"}>
          {/*<Separator className={"mb-2"} />*/}
          <Button
            className={"mb-2 w-fit"}
            variant={"outline"}
            type={"button"}
            onClick={() => {
              append({ ...defaultRowValues })
            }}
          >
            <IconPlusFilled />
            {addButtonTitle ?? "Добавить"}
          </Button>
        </div>
      )}
    </Field>
  )
}
