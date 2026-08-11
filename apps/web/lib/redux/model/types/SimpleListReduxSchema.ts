import { EntityState } from "@reduxjs/toolkit"

export interface SimpleListReduxSchema<EntityType> extends EntityState<
  EntityType,
  string
> {
  isFetching?: boolean
  error?: string
  _isInitialized: boolean
}
