import { Certificate } from "../types/certificate.schema"
import dayjs from "dayjs"

export class CertificateHelper {
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
}
