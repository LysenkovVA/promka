"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { Berth } from "../types/berth.schema"
import { CreateBerthRequestSchema } from "../types/create-berth-request.schema"
import { getBerthByIdThunk } from "../thunks/get-berth-by-id.thunk"
import { updateBerthThunk } from "../thunks/update-berth.thunk"

const initialState: DetailsReduxSchema<Berth> = {
  entityData: { name: "", workspace: { company: { name: "" } } },
  entityFormData: { name: "", workspace: { company: { name: "" } } },
  validationErrors: {},
  error: "",
  isFetching: false,
  isSaving: false,
  _isInitialized: false,
}

export const berthDetailsSlice = createSlice({
  name: "berthDetailsSlice",
  initialState,
  reducers: {
    setInitialized: (
      state,
      action: PayloadAction<{ isInitialized: boolean }>
    ) => {
      state._isInitialized = action.payload.isInitialized
    },
    setFormData: (state, action: PayloadAction<{ data: Berth }>) => {
      state.entityFormData = action.payload.data
      // Валидация при изменении данных
      const result = CreateBerthRequestSchema.safeParse(action.payload.data)
      if (!result.success) {
        const errors: Record<string, string> = {}
        for (const issue of result.error.issues) {
          if (issue.path.length > 0) {
            const field = issue.path[0]
            errors[field as string] = issue.message
          }
        }
        state.validationErrors = errors
      } else {
        state.validationErrors = {}
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Получение по id
      .addCase(getBerthByIdThunk.pending, (state, action) => {
        state.isFetching = true
        state.isSaving = false
        state.error = ""
        state.entityData = {
          name: "",
          workspace: { company: { name: "" } },
        }
        state.entityFormData = {
          name: "",
          workspace: { company: { name: "" } },
        }
        state._isInitialized = false
      })
      .addCase(getBerthByIdThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
        state.entityFormData = action.payload.data!
        state._isInitialized = true
      })
      .addCase(getBerthByIdThunk.rejected, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = action.payload
        state.entityData = {
          name: "",
          workspace: { company: { name: "" } },
        }
        state.entityFormData = {
          name: "",
          workspace: { company: { name: "" } },
        }
        state._isInitialized = true
      })
      .addCase(updateBerthThunk.fulfilled, (state, action) => {
        state.isFetching = false
        state.isSaving = false
        state.error = ""
        state.entityData = action.payload.data!
        state.entityFormData = action.payload.data!
      })
  },
})

export const { actions: berthDetailsActions, reducer: berthDetailsReducer } =
  berthDetailsSlice
