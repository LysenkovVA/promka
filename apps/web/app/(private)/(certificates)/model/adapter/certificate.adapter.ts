import { createEntityAdapter } from "@reduxjs/toolkit"
import { Certificate } from "../types/certificate.schema"

export const certificateAdapter = createEntityAdapter<Certificate, string>({
  selectId: (entity) => entity.id!,
})
