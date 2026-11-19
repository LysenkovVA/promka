import { createEntityAdapter } from "@reduxjs/toolkit"
import { Study } from "../types/study.schema"

export const studyAdapter = createEntityAdapter<Study, string>({
  selectId: (entity) => entity.id!,
})
