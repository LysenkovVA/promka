import { createEntityAdapter } from "@reduxjs/toolkit"
import { Specialization } from "../types/specialization.schema"

export const specializationAdapter = createEntityAdapter<
  Specialization,
  string
>({
  selectId: (entity) => entity.id!,
})
