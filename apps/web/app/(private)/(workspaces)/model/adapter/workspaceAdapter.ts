import { createEntityAdapter } from "@reduxjs/toolkit"
import { Workspace } from "../types/workspace.schema"

export const workspaceAdapter = createEntityAdapter<Workspace, string>({
  selectId: (entity) => entity.id!,
})
