import { createEntityAdapter } from "@reduxjs/toolkit"
import { SpecializationParameter } from "../types/specialization-parameter.schema"

export const specializationParameterAdapter = createEntityAdapter<
  SpecializationParameter,
  string
>({
  selectId: (entity) => entity.id!,
})
