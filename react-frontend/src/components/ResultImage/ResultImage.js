import "./resultImage.css"
import React, { useEffect, useState } from "react"
import Carousel from "react-bootstrap/Carousel"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { click, resultPicture, resultDefinition } from "../../stateSlice/img"

import Container from "@mui/material/Container"
import LibraryAddIcon from "@mui/icons-material/LibraryAdd"

import Swal from 'sweetalert2'

// 카카오
const REST_API_KEY = process.env.REACT_APP_KAKAO_API_KEY
const REDIRECT_URI = "http://localhost:3000/oauth/kakao/callback"
const LOGIN_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`

export default function ResultImage(){
  const selectedPicture = useSelector(state => state.img.resultPicture)
  const selectedDefinition = useSelector(state => state.img.resultDefinition)
  const selectedWord = useSelector(state => state.img.resultWord)
  const dispatch = useDispatch()

  
  const postWord = (item, e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    
    if (!token) {
      Swal.fire({
        title: 'Login required',
        text: "이미지 저장을 위해 로그인하시겠습니까?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '로그인'
      }).then((result) => {
        if (result.isConfirmed) { 
          window.location.href = LOGIN_URL
        }
      })  
    }
    
    axios({
      method: "post",
      url: "http://127.0.0.1:8000/words/",
      data: {
        "name": selectedWord,
        "meaning": selectedDefinition,
        "image_path": {"image_path": `${item}`}
      },
      headers: {
        "Authorization": "Token " + token 
      }
    })
    .then(res => {
      Swal.fire({
        icon: 'success',
        title: '저장되었습니다',
        showConfirmButton: false,
        timer: 1500
      })
      dispatch(resultPicture([]))
      dispatch(resultDefinition(""))
      dispatch(click())
    })
  }
  return (
    <div className="result-img-component">
    {
      (selectedPicture && selectedDefinition)
      ?
        <Container>
          <Carousel controls="true" interval={null}>
            {selectedPicture.map((item) => (
              <Carousel.Item key={item}>
                <div className="result-img-container">
                  <div
                    className="result-img-background"
                    style={{
                      background: `linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.7)), url(${item})`,
                      backgroundSize:"cover"
                    }}
                  >
                    <div className="result-img-group">
                      <div
                        className="result-img-group-overlay"
                        onClick={e => {postWord(item, e)}}
                      ></div>
                      <LibraryAddIcon
                        sx={{ fontSize: 40 }}
                        className="result-img-group-save"
                        onClick={e => {postWord(item, e)}}
                      />                    
                      <img
                        className="result-img"
                        src={item}
                        srcSet={item}
                        alt={item}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
          <h5 className="result-definition">{selectedDefinition}</h5>
        </Container>
      : null
    }
    </div>
  )
}