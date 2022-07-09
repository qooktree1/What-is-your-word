import './mainpage.css'
import React from 'react'
import { useSelector } from 'react-redux'
import MainImage from '../MainImage/MainImage'
import ResultImage from '../ResultImage/ResultImage'
import Navbar from '../Navbar/Navbar'

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

export default function Mainpage() {
  const selectedDefinition = useSelector(state => state.img.resultDefinition)
  return (
    <div>
      <Navbar />
        {selectedDefinition
        ? <ResultImage />
        : null
        }
        <MainImage />
        <a href="#">
          <KeyboardArrowUpIcon sx={{ color:"white", fontSize: 40 }} className="top-btn" />
        </a>
    </div>
  )
}