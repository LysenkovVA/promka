import type { Employee } from "../model/types/employee.schema"

export class EmployeeHelper {
  static getFullName(employee: Employee | undefined): string {
    if (!employee) return ""

    const parts = [employee.name, employee.patronymic].filter(Boolean)
    return parts.join(" ")
  }
}