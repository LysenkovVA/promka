import { Action, Reducer, ReducersMapObject } from "redux"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { IAuthData } from "@/app/(public)/(auth)"
import { Workspace } from "@/Workspaces"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { Berth, BerthFilters } from "@/Berthes"
import { Employee, EmployeeFilters } from "@/Employees"
import { BerthType } from "@/BerthTypes"
import { BerthTypesFilters } from "@/BerthTypes/model/types/berth-type.filters"
import { EmployeesStatistics } from "@/Employees/model/types/employees-statistics"
import { Department } from "@/Departments"
import { DepartmentFilters } from "@/Departments/model/types/department.filters"
import { CertificateType } from "@/CertificateTypes"
import { CertificateTypesFilters } from "@/CertificateTypes/model/types/certificate-type.filters"
import { Certificate } from "@/Certificates"
import { CertificateFilters } from "@/Certificates/model/types/certificate.filters"
import { InfiniteScrollSchema } from "@/components/inifinite-scroll/model/types/InfiniteScrollSchema"
import { Protocol } from "@/Protocols"
import { ProtocolFilters } from "@/Protocols/model/types/protocol.filters"

/**
 * Схема глобального состояния
 */
export interface GlobalStateSchema {
  // Обязательные составляющие
  // Авторизация
  authSchema: DetailsReduxSchema<IAuthData>

  infiniteScrollSchema: InfiniteScrollSchema
  // Динамические
  workspaceDetailsSchema?: DetailsReduxSchema<Workspace>
  // Сотрудники
  employeeDetailsSchema?: DetailsReduxSchema<Employee>
  employeesSchema?: ListReduxSchema<Employee, EmployeeFilters>
  employeesSelectorSchema?: ListReduxSchema<Employee, EmployeeFilters>
  employeesStatisticsSchema?: DetailsReduxSchema<EmployeesStatistics>
  // Должности
  berthDetailsSchema?: DetailsReduxSchema<Berth>
  berthesSchema?: ListReduxSchema<Berth, BerthFilters>
  // Типы должностей
  berthTypeDetailsSchema?: DetailsReduxSchema<BerthType>
  berthTypesSchema?: ListReduxSchema<BerthType, BerthTypesFilters>
  // Подразделения
  departmentDetailsSchema?: DetailsReduxSchema<Department>
  departmentsSchema?: ListReduxSchema<Department, DepartmentFilters>
  // Типы удостоверений
  certificateTypeDetailsSchema?: DetailsReduxSchema<CertificateType>
  certificateTypesSchema?: ListReduxSchema<
    CertificateType,
    CertificateTypesFilters
  >
  // Удостоверения
  certificateDetailsSchema?: DetailsReduxSchema<Certificate>
  certificatesSchema?: ListReduxSchema<Certificate, CertificateFilters>
  // Протоколы
  protocolDetailsSchema?: DetailsReduxSchema<Protocol>
  protocolsSchema?: ListReduxSchema<Protocol, ProtocolFilters>
  protocolsSelectorSchema?: ListReduxSchema<Protocol, ProtocolFilters>
}

/**
 * Ключи глобальной схемы состояния
 */
export type GlobalStateSchemaKey = keyof GlobalStateSchema

export interface ReducerManager {
  getReducerMap: () => ReducersMapObject<GlobalStateSchema>
  reduce: (state: GlobalStateSchema | undefined, action: Action) => any
  add: (key: GlobalStateSchemaKey, reducer: Reducer) => void
  remove: (key: GlobalStateSchemaKey) => void
  resetState: () => void
}
