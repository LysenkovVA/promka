/**
 * Сбрасывает время и часовой пояс в дате, оставляя только дату.
 * Использует UTC для предотвращения сдвигов при сериализации.
 */
export function stripTimezone(date: Date | undefined): Date | undefined {
  if (!date) return undefined
  
  // Создаём дату через UTC, чтобы избежать сдвигов при конвертации
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
}
