import { useEffect } from 'react'
import axios from 'axios'


export default function Kakao() {
  const REST_API_KEY = process.env.REACT_APP_KAKAO_API_KEY
  const REDIRECT_URI = "https://62c6e048f84c251b3ab4c048--comforting-klepon-944419.netlify.app/"
  const LOGIN_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
  return (
    <div>
    
      <a href={LOGIN_URL}><img src="img/kakao_login_medium.png" alt="카카오 로그인" /></a>
    </div>
  )
}