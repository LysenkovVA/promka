import { User } from "@/Users"

/**
 * Интерфейс данных, полученных при авторизации
 */
export interface IAuthData {
  user: User
  activeWorkspaceId?: string
}
