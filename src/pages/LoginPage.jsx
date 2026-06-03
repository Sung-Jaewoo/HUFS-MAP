import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/auth'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [id, setId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login({ emailOrUsername: id, password })
      navigate('/mypage')
    } catch (loginError) {
      setError(loginError.message || '아이디 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <main className="login-main">
        <div className="circle left"></div>
        <div className="circle right"></div>

        <div className="dots">
          ·····<br />
          ·····<br />
          ·····
        </div>

        <div className="pin">⌖</div>

        <section className="login-card">
          <p className="brand">HUFS MAP</p>

          <h1>로그인</h1>

          <p className="desc">
            HUFS MAP 계정으로 로그인해 주세요.
          </p>

          {error && (
            <p className="error-message">
              ⓘ {error}
            </p>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-row">
              <label>아이디</label>

              <input
                type="text"
                placeholder="아이디를 입력하세요"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>비밀번호</label>

              <div className="password-box">
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <span>⊙</span>
              </div>
            </div>

            <div className="form-options">
              <label>
                <input type="checkbox" />
                아이디 저장
              </label>

              <a href="#">비밀번호를 잊으셨나요?</a>
            </div>

            <button type="submit" className="login-btn">
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <p className="signup">
            계정이 없으신가요?{' '}
            <Link to="/signup">회원가입</Link>
          </p>
        </section>
      </main>
    </div>
  )
}

export default LoginPage
