import dayjs from "dayjs"
import { Protocol } from "../types/protocol.schema"

export class ProtocolHelper {
  static getNumberAndDate(protocol: Protocol | undefined) {
    if (!protocol) {
      return ""
    }

    let numberAndDate = ""

    if (protocol.number) {
      numberAndDate = `№ ${protocol.number}`
    }

    if (protocol.date) {
      numberAndDate +=
        numberAndDate !== ""
          ? ` от ${dayjs(protocol.date).format("DD.MM.YYYY")}`
          : `от ${dayjs(protocol.date).format("DD.MM.YYYY")}`
    }

    return numberAndDate
  }
}
