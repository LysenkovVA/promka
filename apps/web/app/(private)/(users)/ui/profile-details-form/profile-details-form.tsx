"use client"

import { memo, RefObject, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldInput } from "@/components/form/field-input/field-input"
import { FieldDescription, FieldGroup } from "@workspace/ui/components/field"
import { z } from "zod/v4"
import { useAppDispatch } from "@/lib/redux"
import { toast } from "sonner"
import { updateProfileThunk } from "../../model/thunks/update-profile.thunk"
import { useAuth } from "@/app/(public)/(auth)"
import { FieldDatePicker } from "@/components/form/field-date-picker/field-date-picker"
import { Separator } from "@workspace/ui/components/separator"
import { ProfileRequestSchema } from "@/Users/model/types/profile-request.schema"
import { User } from "@/Users/model/types/UserSchema"
import { FieldSnils } from "@/Employees/ui/field-snils/field-snils"
import { FieldPhone } from "@/Employees/ui/field-phone/field-phone"

export interface ProfileDetailsFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  onSubmit?: (data: User) => void
}

export const ProfileDetailsForm = memo((props: ProfileDetailsFormProps) => {
  const { onSubmit, submitRef } = props

  const auth = useAuth()

  const dispatch = useAppDispatch()

  /**
   * If your schema uses .default(...) on a field,
   * that field becomes optional on the schema's input type (z.input)
   * but stays required on its output type (z.output/z.infer) —
   * the default only fills it in after validation. Passing a single
   * generic to useForm<T> pins both to the same type and will conflict
   * with zodResolver, which infers input and output separately.
   * Either omit the generic and let it infer from resolver, or specify all three explicitly
   */
  const form = useForm<
    z.input<typeof ProfileRequestSchema>,
    any,
    z.output<typeof ProfileRequestSchema>
  >({
    resolver: zodResolver(ProfileRequestSchema),
  })

  useEffect(() => {
    form.reset({
      id: auth.user?.id,
      surname: auth.user?.surname!,
      name: auth.user?.name,
      patronymic: auth.user?.patronymic,
      birthDate: auth.user?.birthDate,
      email: auth.user?.email,
      phoneNumber: auth.user?.phoneNumber,
      snils: auth.user?.snils,
      // certificates: data?.certificates ? [...data?.certificates] : [],
    })
  }, [auth.user, form])

  const onSubmitForm = useCallback(
    async (formData: any) => {
      if (formData) {
        // Отправляем на бэкэнд чистые цифры или строку с маской
        const rawDigits = formData?.snils?.replace(/\D/g, "")

        try {
          const result = await dispatch(
            updateProfileThunk({
              entityData: { ...formData, snils: rawDigits },
            })
          ).unwrap()

          if (result.isOk) {
            toast.success("Изменения сохранены", {
              position: "top-center",
              style: {
                color: "green",
              },
            })
            onSubmit?.(result.data!)
          }
        } catch (error) {
          toast.error((error as string) ?? "Ошибка", {
            position: "top-center",
            style: { color: "tomato" },
          })
        }
      }
    },
    [auth?.activeWorkspace?.id, dispatch, onSubmit]
  )

  return (
    <form
      id={"profile-details-form"}
      className={"overflow-y no-scrollbar flex w-full flex-col gap-8 p-2"}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit(onSubmitForm, (errors) =>
          toast.error(JSON.stringify(errors))
        )(e)
      }}
    >
      <FieldGroup>
        <FieldInput
          required={true}
          form={form}
          path={"surname"}
          label={"Фамилия"}
          placeholder={"Укажите фамилию"}
        />
        <div className={"grid grid-cols-2 gap-2"}>
          <FieldInput
            form={form}
            path={"name"}
            label={"Имя"}
            placeholder={"Укажите имя"}
          />
          <FieldInput
            form={form}
            path={"patronymic"}
            label={"Отчество"}
            placeholder={"Укажите отчество"}
          />
        </div>
        <div className={"grid grid-cols-2 gap-2"}>
          <FieldDatePicker
            form={form}
            path={"birthDate"}
            label={"Дата рождения"}
          />
          <FieldSnils
            form={form}
            path={"snils"}
            label={"СНИЛС"}
            placeholder={"Укажите СНИЛС"}
          />
        </div>
      </FieldGroup>
      <FieldGroup>
        <FieldDescription>{"Контакты"}</FieldDescription>
        <Separator />
        <div className={"grid grid-cols-2 gap-2"}>
          <FieldPhone
            form={form}
            path={"phoneNumber"}
            label={"Телефон"}
            placeholder={"Укажите телефон"}
          />
          {/*<FieldInput*/}
          {/*  form={form}*/}
          {/*  path={"email"}*/}
          {/*  label={"E-mail"}*/}
          {/*  placeholder={"Укажите e-mail"}*/}
          {/*/>*/}
        </div>
      </FieldGroup>
      <input type={"submit"} hidden ref={submitRef} />
    </form>
  )
})
