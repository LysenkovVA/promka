import type { Employee } from "../model/types/employee.schema"

export class EmployeeHelper {
  static getNameAndPatronymic(employee: Employee | undefined): string {
    if (!employee) return ""

    const parts = [employee.name, employee.patronymic].filter(Boolean)
    return parts.join(" ")
  }

  static getFullName(employee: Employee | undefined): string {
    if (!employee) return ""

    const parts = [
      employee.surname,
      this.getNameAndPatronymic(employee),
    ].filter(Boolean)
    return parts.join(" ")
  }
}
