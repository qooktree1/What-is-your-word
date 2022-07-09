import { configureStore } from "@reduxjs/toolkit"
import imgReducer from "../stateSlice/img"

export const store = configureStore({
  reducer: {
    img:
      imgReducer,

  },
})