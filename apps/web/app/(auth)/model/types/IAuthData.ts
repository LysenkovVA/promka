import { IUserEntity } from "@/app/(private)/(users)"

/**
 * Интерфейс данных, полученных при авторизации
 */
export interface IAuthData {
  user: IUserEntity
}
