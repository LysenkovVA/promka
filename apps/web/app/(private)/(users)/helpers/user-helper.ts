import { User } from "@/Users/model/types/UserSchema"

export class UserHelper {
  static getNameAndPatronymic(user: User | undefined): string {
    if (!user) return ""

    const parts = [user.name, user.patronymic].filter(Boolean)
    return parts.join(" ")
  }

  static getFullName(user: User | undefined): string {
    if (!user) return ""

    const parts = [user.surname, this.getNameAndPatronymic(user)].filter(
      Boolean
    )
    return parts.join(" ")
  }
}
