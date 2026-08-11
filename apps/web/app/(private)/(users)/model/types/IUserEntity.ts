import { ICompanyEntity } from "@/app/(private)/(companies)/model/types/ICompanyEntity"
import { IFileEntity } from "@/app/(private)/(files)"

export interface IUserEntity {
  id?: string | null
  email: string
  hashedPassword: string
  phoneNumber?: string | null
  emailConfirmed: boolean
  phoneNumberConfirmed: boolean
  surname?: string | null
  name?: string | null
  birthDate?: string | Date | null
  avatar?: IFileEntity | null
  companies?: Array<ICompanyEntity>
}
