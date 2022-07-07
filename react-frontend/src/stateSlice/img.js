import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  imgClicked: 0,
  resultPicture: [],
  resultDefinition: null,
  resultWord: null,
  showResult: 'hidden',
}

export const img = createSlice({
  name: 'img',
  initialState,
  reducers: {
    click: state => {
      state.imgClicked += 1
    },
    resultPicture: (state,action) => {
      state.resultPicture = action.payload
    },
    resultDefinition: (state, action) => {
      state.resultDefinition = action.payload
    },
    resultWord: (state, action) => {
      state.resultWord = action.payload
    },
    showResult: (state, action) => {
      state.showResult = action.payload
    }
  }
})

export const { click, resultPicture, resultDefinition, resultWord, showResult } = img.actions
export default img.reducer