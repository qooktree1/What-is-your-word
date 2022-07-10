import "./searchbar.css"
import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { resultPicture, resultDefinition, resultWord } from "../../stateSlice/img"

import SearchIcon from "@mui/icons-material/Search"
import { Button } from "@mui/material"

import Swal from 'sweetalert2'

// Pexel API
const PEXELS_IMAGE_API_KEY = process.env.REACT_APP_IMAGE_API_KEY_2 

export default function Searchbar() {
  const selectedWord = useSelector(state => state.img.resultWord)
  const selectedPicture = useSelector(state => state.img.resultPicture)

  const dispatch = useDispatch()

  const onChange = e => {
    e.preventDefault()
    dispatch(resultWord(e.target.value))
  }

  const searchImg = e => {
    e.preventDefault()
    dispatch(resultDefinition(null))

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
        const fullUrl = []
        for (let i = 0; i < images.length; i++) {
          fullUrl.push(images[i].src.original)
        }
        dispatch(resultPicture(fullUrl))

        axios({
          method: "get",
          url: `https://api.dictionaryapi.dev/api/v2/entries/en/${selectedWord}`,
        })
          .then(res => {
            dispatch(resultDefinition(res.data[0].meanings[0].definitions[0].definition))
            }
          )
          .catch(err => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: '검색결과가 없습니다.',
            })
          })
      })
      .catch(err =>
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: '검색결과가 없습니다.',
        })
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