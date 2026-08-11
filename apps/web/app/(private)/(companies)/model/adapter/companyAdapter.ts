import { createEntityAdapter } from "@reduxjs/toolkit"
import { ICompanyEntity } from "../types/ICompanyEntity"

export const companyAdapter = createEntityAdapter<ICompanyEntity, string>({
  selectId: (entity) => entity.id!,
})
