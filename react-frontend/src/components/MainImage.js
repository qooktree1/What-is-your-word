// LINK IN SOF
import './styles.css'
import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { click } from '../stateSlice/img'
import axios from 'axios'

import { createTheme } from '@mui/material/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal'
import { Paper, Button, Container} from '@mui/material'
import Masonry from '@mui/lab/Masonry'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

const theme = createTheme({
  breakpoints: {
    values: {
      none: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    },
  },
})


export default function MainImage() {
  const imgClickCount = useSelector(state => state.img.imgClicked)
  const dispatch = useDispatch()

  const [wordsList, setWordsList] = useState([])
  const [imageIndex, setImageIndex] = useState(0)
  const [showSelected, setShowSelected] = useState({position: 'absolute'})
  


  // => arr형태 
  useEffect(() => {
    const token = localStorage.getItem('token')
    axios({
      method: 'get',
      url: 'https://whatisyourword.link/api/v1/words/',
      headers: {
        "Authorization": "Token " + token 
      }
    })
      .then(res => {
        console.log('res', res)
        setWordsList(res.data)
      })
  },[imgClickCount])

  const matchDownXl = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const matchDownLg = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const matchDownMd = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const matchDownSm = useMediaQuery(theme.breakpoints.between('none', 'sm'));

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setShowSelected({position: 'relative'})
  }
  
  // 삭제
  const [del, setDel] = useState(false)
  const [delWord, setDelWord] = useState('')
  const deleteConfirm = e => {
    setDelWord(e)
    setDel(true)
  }

  const deleteConfirmClose = () => {
      setDelWord('')
      setDel(false)
  }


  // 삭제
  const wordDelete = e => { // e= item.word
    const token = localStorage.getItem('token')

    axios({
      method: 'delete',
      url: 'https://whatisyourword.link/api/v1/words/',
      headers: {
        "Authorization": "Token " + token 
      },
      data: {
        'name': e
      },
    })
      .then(res => {
        dispatch(click())
        deleteConfirmClose()
      })
  }



  return (
    <div>

      <div>
        <Container maxWidth={false} style={{paddingLeft:"70px", paddingRight:"70px"}}>
          <Box>
            <Masonry columns={matchDownSm ? 1 : matchDownMd ? 2 : matchDownLg ? 3 : matchDownXl ? 4 : 6} spacing={2} sx={{margin: '0px'}}>
              {console.log('w',wordsList)}
              {wordsList.map((item, index) => (
                <div key={index} className={'flip-card'} tabIndex="0">
                  <div className={'flip-card-inner'}>
                    <div className="flip-card-front">
                    <img
                      src={`${item.image_path}`}
                      srcSet={`${item.image_path}`}
                      alt={item.name}
                      className={'data-img'}
                      loading="lazy"
                      onClick={
                        () => {
                          handleOpen()
                          setImageIndex(index)
                        }
                      }
                      style={{
                        display: 'block',
                        width: '100%',
                      }}
                    />
                    </div>
                    <div className='flip-card-back'>
                    <img
                      src={`${item.image_path}`}
                      srcSet={`${item.image_path}`}
                      alt={item.name}
                      className={'data-img img-back'}
                      loading="lazy"
                      onClick={
                        () => {
                          handleOpen()
                          setImageIndex(index)
                        }
                      }
                      style={{
                        display: 'block',
                        width: '100%',
                      }}
                    />
                    <h3
                      className="image-title"
                      onClick={
                        () => {
                          handleOpen()
                          setImageIndex(index)
                        }
                      }
                    >{item.name}</h3>
                    <HighlightOffIcon
                      className="delete-button"
                      onClick={() => deleteConfirm(item.name)}
                    >
                    </HighlightOffIcon>
                  </div>
                </div>
              </div>
              ))}
            </Masonry>
          </Box>
        </Container>
      </div>

      {/* 각각의 사진 보여주기 */}
      <Modal
        open={open}
        onClose={handleClose}
        onKeyDown={
          e => {
            e.preventDefault()
              if (e.key === "ArrowLeft" && imageIndex !== 0) {
                setImageIndex(num => num - 1)
              } else if (e.key === "ArrowRight" && imageIndex !== wordsList.length - 1) { 
                setImageIndex(num => num + 1)
              }
          }
        }
      >
        <Box style={showSelected} className="result-container2">
          <div className="result-background2" style={{maxWidth: '60vw',objectFit: 'fill', background: `linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.7)), url(${wordsList[imageIndex]?.image_path})`}}>
            <img src={wordsList[imageIndex]?.image_path} className="result-img3" onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src="https://cdn.pixabay.com/photo/2016/10/09/17/28/closed-1726363_960_720.jpg";
            }}
            />
            <div className="result-font">
              <p className="word-title"><b style={{fontSize: '32px'}}>{wordsList[imageIndex]?.name}</b></p>
              <p className="word-content">{wordsList[imageIndex]?.meaning}</p>
            </div>


            {/* 버튼 영역 */}
            <div className="btnDiv">
              <ArrowBackIosNewIcon
                sx={{ color: 'white', fontSize: 40}}
                className="prevBtn"
                onClick={e => {
                  e.preventDefault()
                  if (imageIndex !== 0) {
                    setImageIndex(num => num - 1)
                  }
                }}
              />

              <ArrowForwardIosIcon
                sx={{ color: 'white', fontSize: 40}}
                className="nextBtn"
                onClick={e => {
                  e.preventDefault()
                  if (imageIndex !== wordsList.length - 1) {
                    setImageIndex(num => num + 1)
                  }
                }}
              >Next
              </ArrowForwardIosIcon>
            </div>
          </div>
        </Box>
      </Modal>

      
      {/* 삭제 확인 Modal */}
      <Modal
        open={del}
        onClose={deleteConfirmClose}
        className="deleteModal"
      >
        <Box className="deleteBox">
          <h5 style={{position: 'relative', top: '10%'}}>단어를 정말 삭제하시겠습니까?</h5>
          <br />
          <div className="deleteBtns">
            <Button color="error" variant="contained" onClick={() => wordDelete(delWord)}>삭제</Button>
            <Button color="grey" variant="contained" style={{marginLeft: '20px'}} onClick={deleteConfirmClose}>취소</Button>
          </div>
        </Box>

      </Modal>

    </div>
  )
}