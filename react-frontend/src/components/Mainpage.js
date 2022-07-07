import './styles.css'
import React from 'react'
import { useSelector } from 'react-redux'
// import LoginGoogle from './Google/LoginGoogle'
// import GoogleButton from './Google/GoogleButton'
import MainImage from './MainImage'
import ResultImage from './ResultImage'
import Navbar from './Navbar'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

export default function Mainpage() {
  const selectedDefinition = useSelector(state => state.img.resultDefinition)
  return (
    <div className="body">
      <Navbar />
        {selectedDefinition
        ? <ResultImage />
        : null
        }
        <MainImage />
        <a href="#">
          <KeyboardArrowUpIcon sx={{color:"white", fontSize: 40 }} className="top-button" />
        </a>
      {/* <LoginGoogle /> */}
      {/* <GoogleButton /> */}      
    </div>
  )
}