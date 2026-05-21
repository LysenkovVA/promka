import { EntityState } from "@reduxjs/toolkit"

export interface ListReduxSchema<
  EntityType,
  FilterType extends string,
> extends EntityState<EntityType, string> {
  isLoading?: boolean
  error?: string
  // Pagination
  take: number
  skip: number
  search?: string
  filters?: OptionalRecord<FilterType, string[] | undefined>
  // filters?: FilterType;
  formDataFilters?: OptionalRecord<FilterType, string[] | undefined> // Фильтры, которые редактируются, но еще не применены
  totalCount: number
  hasMore: boolean
  _isInitialized: boolean
}
