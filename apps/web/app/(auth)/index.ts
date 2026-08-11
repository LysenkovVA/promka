import { getStore } from "../../lib/redux/model/storeInstance"
import { authActions, authReducer } from "./model/slice/authSlice"
import { IAuthData } from "./model/types/IAuthData"
import { checkAuth } from "./api/checkAuth"

import { useUser } from "./model/hooks/useUser"

export { getStore, authActions, authReducer, useUser, checkAuth }
export type { IAuthData }
