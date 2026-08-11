import { IUserEntity } from "@/app/(private)/(users)"
import { ICompanyEntity } from "@/app/(private)/(companies)"

/**
 * Интерфейс данных, полученных при авторизации
 */
export interface IAuthData {
  user: IUserEntity
  activeCompany?: ICompanyEntity
}
