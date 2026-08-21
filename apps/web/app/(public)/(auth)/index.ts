import { getStore } from "../../../lib/redux/model/storeInstance"
import { authActions, authReducer } from "./model/slice/authSlice"
import { IAuthData } from "./model/types/IAuthData"
import { checkAuth } from "./api/checkAuth"

import { useAuth } from "./model/hooks/useAuth"

export { getStore, authActions, authReducer, useAuth, checkAuth }
export type { IAuthData }
