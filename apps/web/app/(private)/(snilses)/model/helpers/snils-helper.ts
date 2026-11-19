export class SnilsHelper {
  // Функция валидации контрольной суммы СНИЛС
  static validateSnils(snils: string) {
    if (!snils) return true

    // Убираем все символы, кроме цифр
    const cleanSnils = snils.replace(/\D/g, "")

    if (cleanSnils.length !== 11) return false

    // Проверка на зарезервированные последовательности
    if (parseInt(cleanSnils.slice(0, 9)) <= 1001998) return true

    const digits = cleanSnils.slice(0, 9).split("").map(Number)
    const checksum = parseInt(cleanSnils.slice(9, 11))

    let sum = 0
    for (let i = 0; i < 9; i++) {
      // @ts-ignore
      sum += digits[i] * (9 - i)
    }

    let calculatedChecksum = 0
    if (sum < 100) {
      calculatedChecksum = sum
    } else if (sum === 100 || sum === 101) {
      calculatedChecksum = 0
    } else {
      const remainder = sum % 101
      calculatedChecksum =
        remainder === 100 || remainder === 101 ? 0 : remainder
    }

    return calculatedChecksum === checksum
  }
}
