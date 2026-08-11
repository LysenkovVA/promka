import { IUserEntity } from "@/app/(private)/(users)"

export interface IFileEntity {
  id?: string | null
  s3name: string
  size: number
  mimeType: string
  fileName: string
  user?: IUserEntity | null
}
