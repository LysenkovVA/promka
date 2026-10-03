import { createEntityAdapter } from "@reduxjs/toolkit"
import { BerthType } from "../types/berth-type.schema"

export const berthTypeAdapter = createEntityAdapter<BerthType, string>({
  selectId: (entity) => entity.id!,
})
