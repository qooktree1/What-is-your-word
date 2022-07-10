export default function Kakao() {
  const REST_API_KEY = process.env.REACT_APP_KAKAO_API_KEY
  const REDIRECT_URI = "http://localhost:3000/oauth/kakao/callback"
  const LOGIN_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`

  return (
    <div>
      <a href={LOGIN_URL}><img src="img/kakao_login_medium.png" alt="카카오 로그인" /></a>
    </div>
  )
}