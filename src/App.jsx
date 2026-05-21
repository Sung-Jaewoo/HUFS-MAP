import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'
import EditProfilePage from './pages/EditProfilePage'
import MyPostsPage from './pages/MyPostsPage'
import CommentPage from './pages/CommentPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/edit" element={<EditProfilePage />} />
        <Route path="/mypage/posts" element={<MyPostsPage />} />
        <Route path="/mypage/comments" element={<CommentPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App