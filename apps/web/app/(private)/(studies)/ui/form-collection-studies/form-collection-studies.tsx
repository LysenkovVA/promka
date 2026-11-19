"use client"

import { memo } from "react"
import { FormCollection } from "@/components/form/form-collection/form-collection"
import { Button } from "@workspace/ui/components/button"
import { IconTrash } from "@tabler/icons-react"
import { FormCollectionEmployees } from "@/Employees"
import { useFormContext, useWatch } from "react-hook-form"
import { FieldSpecialization } from "@/Specializations"
import { FormCollectionCertificates } from "@/Certificates"

export interface FormCollectionStudiesProps {
  name: string
}

export const FormCollectionStudies = memo(
  (props: FormCollectionStudiesProps) => {
    const { name } = props

    const { watch, control } = useFormContext()

    const formValues = useWatch({
      control,
      name,
    })

    const getHasEmployees = (index: number) => {
      const item = formValues?.[index]
      return Array.isArray(item?.employees) && item.employees.length > 0
    }

    const getHasCertificates = (index: number) => {
      const item = formValues?.[index]
      return Array.isArray(item?.certificates) && item.certificates.length > 0
    }

    return (
      <FormCollection
        name={name}
        defaultRowValues={[]}
        listTitle={"Список обучений"}
        showAddButton={true}
        addButtonTitle={
          watch(name)?.length > 0 ? "Обучение" : "Список обучений"
        }
      >
        {(fields, methods) => (
          <>
            {fields.map((field, index) => (
              <div
                key={index}
                className={"flex items-start justify-start gap-2"}
              >
                <div className={"mt-2 flex items-center justify-center gap-1"}>
                  <Button
                    type={"button"}
                    size={"icon"}
                    variant={"destructive"}
                    onClick={() => methods.remove(index)}
                  >
                    <IconTrash className={"text-destructive"} />
                  </Button>
                  <div
                    className={"text-xl text-muted-foreground"}
                  >{`${index + 1}.`}</div>
                </div>
                <div
                  className={
                    "flex w-full flex-col items-start justify-center gap-2"
                  }
                >
                  <FieldSpecialization
                    name={methods.getItemPath(index, "specialization")}
                  />
                  {/* Если выбрано обучение, показываем кнопки добавления списков */}
                  {watch(methods.getItemPath(index, "specialization"))?.id && (
                    <div
                      className={
                        !getHasEmployees(index) && !getHasCertificates(index)
                          ? "flex w-fit flex-row items-start justify-start gap-2"
                          : "w-full"
                      }
                    >
                      {(!getHasEmployees(index) &&
                        !getHasCertificates(index)) ||
                      (getHasEmployees(index) && !getHasCertificates(index)) ? (
                        <FormCollectionEmployees
                          name={methods.getItemPath(index, "employees")}
                        />
                      ) : null}
                      {(!getHasEmployees(index) &&
                        !getHasCertificates(index)) ||
                      (!getHasEmployees(index) && getHasCertificates(index)) ? (
                        <FormCollectionCertificates
                          name={methods.getItemPath(index, "certificates")}
                        />
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </FormCollection>
    )
  }
)
