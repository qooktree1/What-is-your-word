import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import { useSelector, useDispatch } from 'react-redux'
import { click, resultPicture, resultDefinition } from '../stateSlice/img'
import Container from '@mui/material/Container'
import './styles.css'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'

export default function ResultImage(){
  const selectedPicture = useSelector(state => state.img.resultPicture)
  const selectedDefinition = useSelector(state => state.img.resultDefinition)
  const selectedWord = useSelector(state => state.img.resultWord)
  const dispatch = useDispatch()
  
  const [alertState, setAlertState] = useState(false)
  const [s, setS] = useState(1)
  console.log('a',s)
  
  const postWord = (item, e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/words/',
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
      setS(s => s +1)
      dispatch(resultPicture([]))
      dispatch(resultDefinition(''))
      dispatch(click())
    })
  }
  useEffect(() => {
    console.log('a',s)
    setAlertState(true)
    // alert(<Alert variant="filled" severity="info">저장되었습니다!</Alert>)
    setTimeout(() => {
      setAlertState(false)
    }, 2000)
  }, [s])
  
  console.log('a',s)
  return (
    <div className="result-image">
      <Container>
        <Carousel controls="true" interval={null}>
          {selectedPicture.map((item) => (
            <Carousel.Item key={item}>
              <div className="result-container">
                <div className="result-background" style={{background: `linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.7)), url(${item})`, backgroundSize:'cover'}}>
                  <div class="section">
                    <div class="overlay"></div>
                    <LibraryAddIcon
                      sx={{ fontSize: 40}}
                      className="save"
                      onClick={e => {postWord(item, e)}}
                    />                    
                    <img
                      className="box-1"
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
        <h5 className="result-font">{selectedDefinition}</h5>
      </Container>
    </div>
  )
}