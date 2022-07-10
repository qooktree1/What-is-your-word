import axios from "axios"
import { useEffect } from "react"
export default function KakaoRedirectHandler() {
  const code = new URL(window.location.href).searchParams.get("code")
  useEffect(() => {
      axios({
        method: "POST",
        url: "http://localhost:8000/accounts/kakao/redirect/",
        data: code,
      })
        .then(res => {
          localStorage.setItem("token", res.data.key)
          localStorage.setItem("social_id", res.data.social_id)
          localStorage.setItem("access_token", res.data.access_token)
          localStorage.setItem("nickname", res.data.nickname)
          const access = localStorage.getItem("access_token")
          console.log(access)
          window.location.replace("/")
        })
      }, [])
  return null
}