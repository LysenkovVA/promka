import { User } from "../../../../(private)/(users)/model/types/UserSchema"

/**
 * Интерфейс данных, полученных при авторизации
 */
export interface IAuthData {
  user: User
  activeWorkspaceId?: string
}
