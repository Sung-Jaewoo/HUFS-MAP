import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Postpage from './pages/Postpage'
import MyPage from './pages/Mypage'
import EditProfilePage from './pages/EditProfilePage'
import MyPostsPage from './pages/MyPostsPage'
import CommentPage from './pages/CommentPage'
import FavoritePage from './pages/FavoritePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/post" element={<Postpage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/edit" element={<EditProfilePage />} />
        <Route path="/mypage/posts" element={<MyPostsPage />} />
        <Route path="/mypage/comments" element={<CommentPage />} />
        <Route path="/mypage/favorites" element={<FavoritePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
