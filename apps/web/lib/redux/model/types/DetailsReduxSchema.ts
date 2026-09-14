export interface DetailsReduxSchema<EntityType> {
  entityData?: EntityType
  entityFormData?: EntityType
  validationErrors?: Record<string, string>
  isFetching: boolean
  isSaving: boolean
  error?: string
  _isInitialized: boolean
}
