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
import { Specialization } from "@/Specializations"
import { SpecializationsFilters } from "@/Specializations/model/types/specialization.filters"
import { InfiniteScrollSchema } from "@/components/inifinite-scroll/model/types/InfiniteScrollSchema"
import { WorkspaceFilters } from "@/Workspaces/model/types/workspace.filters"
import { StudyOrganization } from "@/StudyOrganizations"
import { StudyOrganizationFilters } from "@/StudyOrganizations/model/types/study-organization.filters"
import { SpecializationParameter } from "@/SpecializationParameters"
import { SpecializationParametersFilters } from "@/SpecializationParameters/model/types/specialization-parameter.filters"
import { SpecializationDirection } from "@/SpecializationDirections"
import { SpecializationDirectionsFilters } from "@/SpecializationDirections/model/types/specialization-direction.filters"
import { Study } from "@/Studies/model/types/study.schema"
import { StudyFilters } from "@/Studies/model/types/study.filters"
import { Protocol } from "@/Protocols"

/**
 * Схема глобального состояния
 */
export interface GlobalStateSchema {
  // Обязательные составляющие
  // Авторизация
  authSchema: DetailsReduxSchema<IAuthData>

  infiniteScrollSchema: InfiniteScrollSchema
  // Динамические
  workspacesSchema?: ListReduxSchema<Workspace, WorkspaceFilters>
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
  specializationDetailsSchema?: DetailsReduxSchema<Specialization>
  specializationsSchema?: ListReduxSchema<
    Specialization,
    SpecializationsFilters
  >
  // Типы удостоверений
  specializationParameterDetailsSchema?: DetailsReduxSchema<SpecializationParameter>
  specializationParametersSchema?: ListReduxSchema<
    SpecializationParameter,
    SpecializationParametersFilters
  >
  // Направления типов удостоверений
  specializationDirectionDetailsSchema?: DetailsReduxSchema<SpecializationDirection>
  specializationDirectionsSchema?: ListReduxSchema<
    SpecializationDirection,
    SpecializationDirectionsFilters
  >
  // Обучение
  studyDetailsSchema?: DetailsReduxSchema<Study>
  studiesSchema?: ListReduxSchema<Study, StudyFilters>

  // Протоколы
  protocolDetailsSchema?: DetailsReduxSchema<Protocol>

  // Образовательные организации
  studyOrganizationDetailsSchema?: DetailsReduxSchema<StudyOrganization>
  studyOrganizationsSchema?: ListReduxSchema<
    StudyOrganization,
    StudyOrganizationFilters
  >
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
