export const ZOD_VALUE_REQUIRED =
  "Поле не найдено или значение поля не указано (является обязательным)"
export const ZOD_INVALID_OBJECT_TYPE = "Значение поля должно быть объектом"
export const ZOD_INVALID_STRING_TYPE = "Значение поля должно быть строкой"
export const ZOD_INVALID_NUMBER_TYPE = "Значение поля должно быть числом"
export const ZOD_INVALID_DATETIME_TYPE = "Значение поля должно быть датой"
export const ZOD_INVALID_BOOLEAN_TYPE =
  "Значение поля должно быть логическим значением"
export const ZOD_INVALID_CUID_FORMAT = (value: any) =>
  `Идентификатор CUID указан некорректно. Значение '${value}' не может быть CUID`
export const ZOD_INVALID_DATETIME_FORMAT =
  "Значение поля должно быть датой"
export const ZOD_INVALID_EMAIL_FORMAT =
  "Адрес электронной почты указан некорректно"
export const ZOD_TO_SMALL_ARRAY = (minimum: number | bigint) =>
  `Массив не может содержать количество объектов менее ${minimum}`
export const ZOD_INVALID_ENUM_VALUE =
  "Значение перечисления указано некорректно"
