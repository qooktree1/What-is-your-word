import "./mainImage.css"
import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { click } from "../../stateSlice/img"

import { createTheme } from "@mui/material/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import { Button, Container} from "@mui/material"
import Masonry from "@mui/lab/Masonry"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import Swal from 'sweetalert2'

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
  const [showSelected, setShowSelected] = useState({position: "absolute"})
  


  // => arr형태 
  useEffect(() => {
    const token = localStorage.getItem("token")
    axios({
      method: "get",
      url: "http://127.0.0.1:8000/words/",
      headers: {
        "Authorization": "Token " + token 
      }
    })
      .then(res => {
        setWordsList(res.data)
      })
  },[imgClickCount])

  const matchDownXl = useMediaQuery(theme.breakpoints.between("lg", "xl"))
  const matchDownLg = useMediaQuery(theme.breakpoints.between("md", "lg"))
  const matchDownMd = useMediaQuery(theme.breakpoints.between("sm", "md"))
  const matchDownSm = useMediaQuery(theme.breakpoints.between("none", "sm"))

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setShowSelected({position: "relative"})
  }
  
  // 삭제
  const wordDelete = e => { // e= item.word

    Swal.fire({
      title: "Are you sure?",
      text: "단어를 정말 삭제하시겠습니까?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#8a8a8a',
      confirmButtonText: '삭제',
      allowEnterKey: false,
    }).then((result) => {
      if (result.isConfirmed) {

        const token = localStorage.getItem("token")

        axios({
          method: "delete",
          url: "http://127.0.0.1:8000/words/",
          headers: {
            "Authorization": "Token " + token 
          },
          data: {
            "name": e
          },
        })
          .then(res => {
            dispatch(click())
            Swal.fire(
              'Deleted!',
              'Your Image has been deleted.',
              'success'
            )            
          })      
      }
    })    
  }

  return (
    <div>
      <div>
        <Container maxWidth={false} style={{paddingLeft:"70px", paddingRight:"70px"}}>
          <Box>
            <Masonry columns={matchDownSm ? 1 : matchDownMd ? 2 : matchDownLg ? 3 : matchDownXl ? 4 : 6} spacing={2} sx={{ margin: "0px" }}>
              {wordsList.map((item, index) => (
                <div key={index} className={"flip-card"} tabIndex="0">
                  <div className={"flip-card-inner"}>
                    <div className="flip-card-front">
                    <img
                      src={`${item.image_path}`}
                      srcSet={`${item.image_path}`}
                      alt={item.name}
                      className={"flip-card-img"}
                      loading="lazy"
                      onClick={
                        () => {
                          handleOpen()
                          setImageIndex(index)
                        }
                      }
                      style={{
                        display: "block",
                        width: "100%",
                      }}
                    />
                    </div>
                    <div className="flip-card-back">
                    <img
                      src={`${item.image_path}`}
                      srcSet={`${item.image_path}`}
                      alt={item.name}
                      className={"flip-card-img flip-card-img-back"}
                      loading="lazy"
                      onClick={
                        () => {
                          handleOpen()
                          setImageIndex(index)
                        }
                      }
                      style={{
                        display: "block",
                        width: "100%",
                      }}
                    />
                    <h3
                      className="flip-card-img-title"
                      onClick={
                        () => {
                          handleOpen()
                          setImageIndex(index)
                        }
                      }
                    >{item.name}</h3>
                    <HighlightOffIcon
                      className="flip-card-img-delete-btn"
                      onClick={() => wordDelete(item.name)}
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
        <Box style={showSelected} className="img-modal-box">
          <div
            className="img-modal-background"
            style={{
              background: `linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.7)), url(${wordsList[imageIndex]?.image_path})`,
              backgroundSize:"cover"
            }}
          >
            <img className="img-modal-imgbody" src={wordsList[imageIndex]?.image_path} onError={({ currentTarget }) => {
              currentTarget.onerror = null // prevents looping
              currentTarget.src="https://cdn.pixabay.com/photo/2016/10/09/17/28/closed-1726363_960_720.jpg"
            }}
            />
            <div>
              <p className="img-modal-title"><b style={{fontSize: "32px"}}>{wordsList[imageIndex]?.name}</b></p>
              <p className="img-modal-content">{wordsList[imageIndex]?.meaning}</p>
            </div>


            {/* 버튼 영역 */}
            <div className="img-modal-btn">
              <ArrowBackIosNewIcon
                sx={{ color: "white", fontSize: 40}}
                className="prev-btn"
                onClick={e => {
                  e.preventDefault()
                  if (imageIndex !== 0) {
                    setImageIndex(num => num - 1)
                  }
                }}
              />

              <ArrowForwardIosIcon
                sx={{ color: "white", fontSize: 40}}
                className="next-btn"
                onClick={e => {
                  e.preventDefault()
                  if (imageIndex !== wordsList.length - 1) {
                    setImageIndex(num => num + 1)
                  }
                }}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  )
}