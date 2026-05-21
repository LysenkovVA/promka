import { EntityState } from "@reduxjs/toolkit";

export interface SimpleListReduxSchema<EntityType>
    extends EntityState<EntityType, string> {
    isLoading?: boolean;
    error?: string;
    _isInitialized: boolean;
}
