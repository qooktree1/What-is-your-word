import './styles.css'
import React from 'react'
import Searchbar from './Searchbar'

export default function Landingpage(){

  return (
    <div>
      <div className="top-img">
        <h1 className="h-landing"><b>당신의 단어를 검색해보세요.</b></h1>
        <h3 className="h-landing"><b>Pictionary</b></h3>
        <Searchbar className="searchbar-landing"/>
 
      </div>
  
    </div>
  )
}