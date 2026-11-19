import dayjs from "dayjs"
import { Specialization } from "@/Specializations"

export class SpecializationHelper {
  static getParameter(specialization: Specialization | undefined): string {
    if (!specialization) return ""

    if (specialization?.specializationParameter?.id) {
      return `${specialization.specializationParameter?.name} ${specialization.specializationParameterValue}`
    }

    return ""
  }

  static getDurationString(specialization: Specialization | undefined): string {
    if (!specialization) return "Срок не определен"

    switch (specialization?.durationAtMonths) {
      case 0:
        return "Бессрочное"
      case 12:
        return "1 год"
      case 36:
        return "3 года"
      case 60:
        return "5 лет"

      default:
        return "Пользовательское"
    }
  }

  static getExpirationDate(
    specialization: Specialization | undefined,
    currentDate: Date
  ): string {
    if (!specialization) return "Окончание неизвестно"

    if (specialization?.durationAtMonths === 0) return "Бессрочное"

    const expirationDate = dayjs(currentDate)
      .add(specialization?.durationAtMonths, "month")
      .format("DD.MM.YYYY")

    return expirationDate
  }

  static getEstimatedTimeString(
    specialization: Specialization | undefined,
    currentDate: Date
  ): string {
    if (!specialization) return "Окончание неизвестно"

    if (specialization?.durationAtMonths === 0) return "Бессрочное"

    const today = dayjs(new Date())

    const expirationDate = dayjs(currentDate).add(
      specialization?.durationAtMonths,
      "month"
    )

    const diff = expirationDate.diff(today, "days")

    if (diff === 0) return "Заканчивается сегодня"

    if (diff > 0) {
      return `Закончится через ${diff} дн.`
    } else {
      return `Просрочено на ${diff * -1} дн.`
    }
  }

  static bgColor(
    specialization: Specialization | undefined,
    currentDate: Date
  ): string {
    if (!specialization) return "bg-red-100"

    if (specialization?.durationAtMonths === 0) return ""

    const today = dayjs(new Date())

    const expirationDate = dayjs(currentDate).add(
      specialization?.durationAtMonths,
      "month"
    )

    const diff = expirationDate.diff(today, "days")

    if (diff > 30) {
      return ""
    }

    if (diff === 0) return "bg-orange-100"

    return "bg-red-100"
  }
}
