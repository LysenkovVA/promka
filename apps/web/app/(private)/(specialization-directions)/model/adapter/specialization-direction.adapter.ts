import { createEntityAdapter } from "@reduxjs/toolkit"
import { SpecializationDirection } from "../types/specialization-direction.schema"

export const specializationDirectionAdapter = createEntityAdapter<
  SpecializationDirection,
  string
>({
  selectId: (entity) => entity.id!,
})
