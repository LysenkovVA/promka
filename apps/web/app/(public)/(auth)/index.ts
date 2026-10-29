import { getStore } from "../../../lib/redux/model/storeInstance"
import { authActions, authReducer } from "./model/slice/authSlice"
import { IAuthData } from "./model/types/IAuthData"
import { checkAuth, checkAuthForWorkspace } from "./api/checkAuth"
import { logoutThunk } from "./model/thunks/logoutThunk"
import { changeActiveWorkspaceThunk } from "./model/thunks/changeActiveWorkspaceThunk"

import { useAuth } from "./model/hooks/useAuth"

export {
  getStore,
  authActions,
  authReducer,
  useAuth,
  checkAuth,
  checkAuthForWorkspace,
  logoutThunk,
  changeActiveWorkspaceThunk,
}
export type { IAuthData }
