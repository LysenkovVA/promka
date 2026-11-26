import { Passport } from "../model/passport.schema"

export class PassportHelper {
  static getSeriesAndNumber(passport: Passport | undefined): string {
    if (!passport) return ""

    const parts = [passport.series, passport.number].filter(Boolean)
    return parts.join(" ")
  }
}
