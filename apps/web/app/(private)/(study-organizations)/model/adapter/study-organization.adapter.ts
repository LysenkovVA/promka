import { createEntityAdapter } from "@reduxjs/toolkit"
import { StudyOrganization } from "../types/study-organization.schema"

export const studyOrganizationAdapter = createEntityAdapter<
  StudyOrganization,
  string
>({
  selectId: (entity) => entity.id!,
})
