import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InfiniteScrollSchema } from "../types/InfiniteScrollSchema";

const initialState: InfiniteScrollSchema = {
    scroll: {},
};

export const infiniteScrollSlice = createSlice({
    name: "infiniteScrollSlice",
    initialState,
    reducers: {
        setScrollPosition: (
            state,
            { payload }: PayloadAction<{ path: string; position: number }>,
        ) => {
            state.scroll[payload.path] = payload.position;
        },
    },
});

export const { actions: InfiniteScrollActions } = infiniteScrollSlice;
export const { reducer: InfiniteScrollReducer } = infiniteScrollSlice;
