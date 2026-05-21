export interface DetailsReduxSchema<EntityType> {
    entityData?: EntityType;
    entityFormData?: EntityType;
    isFetching: boolean;
    isSaving: boolean;
    error?: string;
    _isInitialized: boolean;
}
