import { BrowserRouter, Route, Routes } from "react-router-dom"
import Mainpage from "./components/Mainpage"
import Landingpage from "./components/LandingPage"

import KakaoRedirectHandler from './components/Kakao/KakaoRedirectHandler'

export default function App() {

  return (    
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/landingpage" element={<Landingpage />}/>
          <Route path="/oauth/kakao/callback" element={<KakaoRedirectHandler />} /> {/* Kakao 로그인 Redirect 주소 */}
        </Routes>
    </BrowserRouter>
  )
}