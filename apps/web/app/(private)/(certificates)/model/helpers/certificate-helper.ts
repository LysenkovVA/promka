import { Certificate } from "../types/certificate.schema"
import dayjs from "dayjs"

export class CertificateHelper {
  static getDurationString(certificate: Certificate | undefined): string {
    if (!certificate) return "Срок не определен"

    switch (certificate.certificateType?.durationAtMonths) {
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

  static getNumberAndDate(certificate: Certificate | undefined) {
    if (!certificate) {
      return ""
    }

    let numberAndDate = ""

    if (certificate.number) {
      numberAndDate = `№ ${certificate.number}`
    }

    if (certificate.date) {
      numberAndDate +=
        numberAndDate !== ""
          ? ` от ${dayjs(certificate.date).format("DD.MM.YYYY")}`
          : `от ${dayjs(certificate.date).format("DD.MM.YYYY")}`
    }

    return numberAndDate
  }

  static getExpirationDate(certificate: Certificate | undefined): string {
    if (!certificate) return "Окончание неизвестно"

    if (certificate.certificateType?.durationAtMonths === 0) return "Бессрочное"

    const expirationDate = dayjs(certificate.date)
      .add(certificate.certificateType?.durationAtMonths, "month")
      .format("DD.MM.YYYY")

    return expirationDate
  }

  static getEstimatedTimeString(certificate: Certificate | undefined): string {
    if (!certificate) return "Окончание неизвестно"

    if (certificate.certificateType?.durationAtMonths === 0) return "Бессрочное"

    const today = dayjs(new Date())

    const expirationDate = dayjs(certificate.date).add(
      certificate.certificateType?.durationAtMonths,
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

  static bgColor(certificate: Certificate | undefined): string {
    if (!certificate) return "bg-red-100"

    if (certificate.certificateType?.durationAtMonths === 0)
      return "bg-green-100"

    const today = dayjs(new Date())

    const expirationDate = dayjs(certificate.date).add(
      certificate.certificateType?.durationAtMonths,
      "month"
    )

    const diff = expirationDate.diff(today, "days")

    if (diff > 30) {
      return "bg-green-100"
    }

    if (diff === 0) return "bg-orange-100"

    return "bg-red-300"
  }
}
