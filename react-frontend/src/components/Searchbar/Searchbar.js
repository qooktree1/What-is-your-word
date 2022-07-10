import "./searchbar.css"
import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { resultPicture, resultDefinition, resultWord } from "../../stateSlice/img"

import SearchIcon from "@mui/icons-material/Search"
import { Button } from "@mui/material"

// Pexel API
const PEXELS_IMAGE_API_KEY = process.env.REACT_APP_IMAGE_API_KEY

export default function Searchbar() {
  const selectedWord = useSelector(state => state.img.resultWord)
  const dispatch = useDispatch()

  const onChange = e => {
    e.preventDefault()
    dispatch(resultWord(e.target.value))
  }
  useEffect(() => {
    dispatch(resultPicture([]))
  }, [])

  const searchImg = e => {
    e.preventDefault()

    // pexels
    axios({
      method: "GET",
      url: `https://api.pexels.com/v1/search?query=${selectedWord}&per_page=5`,
      headers: {
        Accept: "applications/json",
        Authorization: PEXELS_IMAGE_API_KEY,
      }
    })
      .then(res => {
        const images = res.data.photos
        console.log(images)
        const fullUrl = []
        for (let i = 0; i < images.length; i++) {
          fullUrl.push(images[i].src.original)
        }
        if (selectedWord) {
          dispatch(resultPicture(fullUrl))
        } else {
          dispatch(resultPicture([]))
        }
      })

    axios({
      method: "get",
      url: `https://api.dictionaryapi.dev/api/v2/entries/en/${selectedWord}`,
    })
      .then(res => {
        dispatch(resultDefinition(res.data[0].meanings[0].definitions[0].definition))
        }
      )
      .catch(
        dispatch(resultDefinition("검색 결과가 없습니다."))
      )
  }

  return (
      <form className="searchbar-form">
        <input className="searchbar" type="text" title="Search" onChange={onChange} />
        <Button type="submit" className="btn" onClick={ searchImg }>
          <SearchIcon className="btn-icon" />
        </Button>
      </form>
  )
}