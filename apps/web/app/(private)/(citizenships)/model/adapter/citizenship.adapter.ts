import { createEntityAdapter } from "@reduxjs/toolkit"
import { Citizenship } from "../types/citizenship.schema"

export const citizenshipAdapter = createEntityAdapter<Citizenship, string>({
  selectId: (entity) => entity.id!,
})
