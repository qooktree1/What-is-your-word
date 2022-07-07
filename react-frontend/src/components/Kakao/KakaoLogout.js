import axios from 'axios'
import { useEffect } from 'react'


function Logout() {
  axios({
    method: 'post',
    url: 'https://whatisyourword.link/api/v1/accounts/kakao/logout/',
    data: allData,
  })
    .then(res => {
      console.log('진짜 끝났어!')
    })
  localStorage.removeItem('access_token')
  localStorage.removeItem('token')
  localStorage.removeItem('social_id')
  localStorage.removeItem('nickname')
  window.location.replace('/')
}

const allData = {
  'access_token': localStorage.getItem('access_token'),
  'token': localStorage.getItem('token'),
}

export default function KakaoLogout() {
  return (
    <span onClick={Logout}>Logout</span>
  )
}