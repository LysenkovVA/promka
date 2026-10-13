import { createEntityAdapter } from "@reduxjs/toolkit"
import { CertificateType } from "../types/certificate-type.schema"

export const certificateTypeAdapter = createEntityAdapter<
  CertificateType,
  string
>({
  selectId: (entity) => entity.id!,
})
