import { createSlice } from "@reduxjs/toolkit"
import { SimpleListReduxSchema } from "@/lib/redux/model/types/SimpleListReduxSchema"
import { IEmployeeEntity } from "../types/IEmployeeEntity"
import { getEmployeesSimpleListThunk } from "../thunks/get-employees-simple-list-thunk"
import { employeeAdapter } from "../adapter/employeeAdapter"
import { upsertEmployeeThunk } from "../thunks/upsert-employee-thunk"
import { deleteEmployeeByIdThunk } from "../thunks/delete-employee-by-id-thunk"

const initialState: SimpleListReduxSchema<IEmployeeEntity> = {
  ids: [],
  entities: {},
  error: undefined,
  isFetching: false,
  _isInitialized: false,
}

export const employeesSimpleListSlice = createSlice({
  name: "employeesSimpleListSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getEmployeesSimpleListThunk.pending,
        (state: SimpleListReduxSchema<IEmployeeEntity>) => {
          state.ids = []
          state.entities = {}
          state.isFetching = true
          state.error = ""
          state._isInitialized = false
        }
      )
      .addCase(
        getEmployeesSimpleListThunk.fulfilled,
        (state: SimpleListReduxSchema<IEmployeeEntity>, action) => {
          state.isFetching = false
          state.error = undefined

          // Если данные заменяются
          if (action.meta.arg.replaceData) {
            // Заменяем данные
            employeeAdapter.setAll(state, action.payload.data!)
          } else {
            // Добавляем порцию данных
            employeeAdapter.addMany(state, action.payload.data!)
          }

          state._isInitialized = true
        }
      )
      .addCase(
        getEmployeesSimpleListThunk.rejected,
        (state: SimpleListReduxSchema<IEmployeeEntity>, action) => {
          state.isFetching = false
          state.error = action.payload
          state._isInitialized = true
        }
      )
      .addCase(
        upsertEmployeeThunk.fulfilled,
        (state: SimpleListReduxSchema<IEmployeeEntity>, action) => {
          if (action.payload.data)
            employeeAdapter.upsertOne(state, action.payload.data)
        }
      )
      .addCase(
        deleteEmployeeByIdThunk.fulfilled,
        (state: SimpleListReduxSchema<IEmployeeEntity>, action) => {
          if (action.payload.data && action.payload.data?.id)
            employeeAdapter.removeOne(state, action.payload.data?.id)
        }
      )
  },
})

export const { actions: employeesSimpleListActions } = employeesSimpleListSlice
export const { reducer: employeesSimpleListReducer } = employeesSimpleListSlice
