import { DynamicModuleLoader } from "./ui/DynamicModuleLoader/DynamicModuleLoader"
import StoreProvider from "./ui/StoreProvider/StoreProvider"

import { ThunkConfig } from "./model/store"

import {
  useAppDispatch,
  useAppSelector,
  useAppStore,
} from "./model/hooks/hooks"

import {
  GlobalStateSchema,
  GlobalStateSchemaKey,
} from "./model/schema/GlobalStateSchema"

export type { GlobalStateSchema, GlobalStateSchemaKey, ThunkConfig }
export {
  useAppDispatch,
  useAppSelector,
  useAppStore,
  DynamicModuleLoader,
  StoreProvider,
}
