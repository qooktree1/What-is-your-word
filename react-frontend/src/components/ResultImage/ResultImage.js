import "./resultImage.css"
import React, { useEffect, useState } from "react"
import Carousel from "react-bootstrap/Carousel"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { click, resultPicture, resultDefinition } from "../../stateSlice/img"

import Container from "@mui/material/Container"
import LibraryAddIcon from "@mui/icons-material/LibraryAdd"

export default function ResultImage(){
  const selectedPicture = useSelector(state => state.img.resultPicture)
  const selectedDefinition = useSelector(state => state.img.resultDefinition)
  const selectedWord = useSelector(state => state.img.resultWord)
  const dispatch = useDispatch()
  
  const [alertState, setAlertState] = useState(false)
  const [delayState, setDelayState] = useState(1)
  
  const postWord = (item, e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
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
      setDelayState(index => index +1)
      dispatch(resultPicture([]))
      dispatch(resultDefinition(""))
      dispatch(click())
    })
  }
  useEffect(() => {
    setAlertState(true)
    setTimeout(() => {
      setAlertState(false)
    }, 2000)
  }, [delayState])
  
  return (
    <div className="result-img-component">
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
                    <div className="result-img-group-overlay"></div>
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
    </div>
  )
}