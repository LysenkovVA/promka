import { Diploma } from "../model/types/diploma.schema"

export class DiplomaHelper {
  static getSeriesAndNumber(diploma: Diploma | undefined): string {
    if (!diploma) return ""

    const parts = [diploma.series, diploma.number].filter(Boolean)
    return parts.join(" ")
  }
}
