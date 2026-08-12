import { IWorkspaceEntity } from "@/app/(private)/(workspaces)/model/types/IWorkspaceEntity"

export interface ICompanyEntity {
  id?: string | null
  name: string
  address?: string | null
  workspace?: IWorkspaceEntity | null
}
