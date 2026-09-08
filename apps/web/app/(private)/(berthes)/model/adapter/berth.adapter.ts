import { createEntityAdapter } from "@reduxjs/toolkit"
import { Berth } from "../types/berth.schema"

export const berthAdapter = createEntityAdapter<Berth, string>({
  selectId: (entity) => entity.id!,
})
