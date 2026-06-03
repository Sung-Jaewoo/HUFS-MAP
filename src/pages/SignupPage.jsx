import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  sendSignupEmailToken,
  signUp,
  verifySignupEmailToken,
} from '../services/auth'
import './SignupPage.css'

function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    code: '',
    userId: '',
    password: '',
    passwordCheck: '',
    nickname: '',
  })

  const [emailTokenUserId, setEmailTokenUserId] = useState('')
  const [errors, setErrors] = useState({})
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: value,
    })

    setErrors({
      ...errors,
      [name]: '',
    })

    setStatusMessage('')

    if (name === 'email' || name === 'userId') {
      setEmailTokenUserId('')
      setIsEmailVerified(false)
    }

    if (name === 'code') {
      setIsEmailVerified(false)
    }
  }

  const validate = ({ requireCode = true, requireProfile = true } = {}) => {
    const newErrors = {}

    if (!form.email.endsWith('@hufs.ac.kr')) {
      newErrors.email =
        '해당 이메일은 존재하지 않습니다. 학교 이메일을 확인해주세요.'
    }

    if (requireCode && form.code.length !== 6) {
      newErrors.code = '인증번호 6자리를 입력해주세요.'
    }

    if (!/^[A-Za-z0-9]{4,20}$/.test(form.userId)) {
      newErrors.userId = '아이디는 영문, 숫자 조합 4~20자로 입력해주세요.'
    }

    if (requireProfile && (
      form.password.length < 8 ||
      !/[A-Za-z]/.test(form.password) ||
      !/[0-9]/.test(form.password) ||
      !/[!@#$%^&*]/.test(form.password)
    )) {
      newErrors.password =
        '영문, 숫자, 특수문자 조합 8~20자로 입력해주세요.'
    }

    if (requireProfile && form.password !== form.passwordCheck) {
      newErrors.passwordCheck = '비밀번호가 일치하지 않습니다.'
    }

    if (requireProfile && (form.nickname.length < 2 || form.nickname.length > 12)) {
      newErrors.nickname =
        '닉네임은 2자 이상 12자 이하로 입력해주세요.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSendCode = async () => {
    if (!validate({ requireCode: false, requireProfile: false })) return

    setIsSendingCode(true)
    setStatusMessage('')

    try {
      const token = await sendSignupEmailToken({
        email: form.email,
        username: form.userId,
      })

      setEmailTokenUserId(token.userId)
      setStatusMessage('인증번호를 이메일로 전송했습니다.')
    } catch (error) {
      setErrors((current) => ({
        ...current,
        email: error.message || '인증번호 전송에 실패했습니다.',
      }))
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!emailTokenUserId) {
      setErrors((current) => ({
        ...current,
        code: '먼저 인증번호를 전송해주세요.',
      }))
      return
    }

    if (form.code.length !== 6) {
      setErrors((current) => ({
        ...current,
        code: '인증번호 6자리를 입력해주세요.',
      }))
      return
    }

    setIsVerifyingCode(true)
    setStatusMessage('')

    try {
      await verifySignupEmailToken({
        userId: emailTokenUserId,
        secret: form.code,
      })
      setIsEmailVerified(true)
      setStatusMessage('이메일 인증이 완료되었습니다.')
    } catch (error) {
      setErrors((current) => ({
        ...current,
        code: error.message || '인증번호 확인에 실패했습니다.',
      }))
    } finally {
      setIsVerifyingCode(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    if (!isEmailVerified) {
      setErrors((current) => ({
        ...current,
        code: '이메일 인증을 완료해주세요.',
      }))
      return
    }

    setIsSubmitting(true)
    setStatusMessage('')

    try {
      await signUp({
        email: form.email,
        password: form.password,
        username: form.userId,
        nickname: form.nickname,
      })
      navigate('/mypage')
    } catch (error) {
      setStatusMessage(error.message || '회원가입에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="signup-page">
      <header className="top-nav">
        <Link to="/campus-map">캠퍼스맵</Link>
        <Link to="/post">게시판</Link>
        <Link to="/mypage">마이페이지</Link>
        <Link to="/login">로그인</Link>
      </header>

      <main className="signup-main">
        <div className="circle left"></div>
        <div className="circle right"></div>

        <div className="dots">
          ·····<br />
          ·····<br />
          ·····
        </div>

        <div className="pin">⌖</div>

        <section className="signup-card">
          <p className="brand">HUFS MAP</p>

          <h1>회원가입</h1>

          <p className="desc">
            학교 이메일 인증 후 서비스를 이용하세요
          </p>

          <form onSubmit={handleSubmit}>
            <div className="signup-form-row">
              <label>학교 이메일 인증</label>

              <div className="signup-field">
                <input
                  className={errors.email ? 'error-input' : ''}
                  name="email"
                  type="email"
                  placeholder="이메일 입력 (예: 202312345@hufs.ac.kr)"
                  value={form.email}
                  onChange={handleChange}
                />

                {errors.email && (
                  <p className="field-error">{errors.email}</p>
                )}
              </div>

              <button
                type="button"
                className="signup-small-btn"
                onClick={handleSendCode}
                disabled={isSendingCode}
              >
                {isSendingCode ? '전송 중' : '전송'}
              </button>
            </div>

            <div className="signup-form-row">
              <label>인증번호 확인</label>

              <div className="signup-field">
                <input
                  className={errors.code ? 'error-input' : ''}
                  name="code"
                  type="text"
                  placeholder="인증번호 6자리를 입력하세요"
                  value={form.code}
                  onChange={handleChange}
                />

                {errors.code && (
                  <p className="field-error">{errors.code}</p>
                )}
              </div>

              <button
                type="button"
                className="signup-small-btn"
                onClick={handleVerifyCode}
                disabled={isVerifyingCode}
              >
                {isVerifyingCode ? '확인 중' : '확인'}
              </button>
            </div>

            {statusMessage && (
              <p className="field-error">{statusMessage}</p>
            )}

            <div className="signup-form-row full">
              <label>아이디</label>

              <div className="signup-field">
                <input
                  className={errors.userId ? 'error-input' : ''}
                  name="userId"
                  type="text"
                  placeholder="영문, 숫자 조합 4~20자"
                  value={form.userId}
                  onChange={handleChange}
                />

                {errors.userId && (
                  <p className="field-error">{errors.userId}</p>
                )}
              </div>
            </div>

            <div className="signup-form-row full">
              <label>비밀번호</label>

              <div className="signup-field">
                <input
                  className={errors.password ? 'error-input' : ''}
                  name="password"
                  type="password"
                  placeholder="영문, 숫자, 특수문자 조합 8~20자"
                  value={form.password}
                  onChange={handleChange}
                />

                {errors.password && (
                  <p className="field-error">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="signup-form-row full">
              <label>비밀번호 확인</label>

              <div className="signup-field">
                <input
                  className={errors.passwordCheck ? 'error-input' : ''}
                  name="passwordCheck"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={form.passwordCheck}
                  onChange={handleChange}
                />

                {errors.passwordCheck && (
                  <p className="field-error">
                    {errors.passwordCheck}
                  </p>
                )}
              </div>
            </div>

            <div className="signup-form-row full">
              <label>닉네임</label>

              <div className="signup-field">
                <input
                  className={errors.nickname ? 'error-input' : ''}
                  name="nickname"
                  type="text"
                  placeholder="닉네임을 입력하세요 (2~12자)"
                  value={form.nickname}
                  onChange={handleChange}
                />

                {errors.nickname && (
                  <p className="field-error">{errors.nickname}</p>
                )}
              </div>
            </div>

            <div className="signup-form-row full">
              <label>프로필 사진</label>

              <button
                type="button"
                className="signup-upload-btn"
              >
                ＋ 프로필 사진 첨부
              </button>
            </div>

            <button
              type="submit"
              className="signup-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? '가입 중...' : '회원가입'}
            </button>
          </form>

          <p className="login-link">
            이미 계정이 있으신가요?{' '}
            <Link to="/login">로그인</Link>
          </p>
        </section>
      </main>
    </div>
  )
}

export default SignupPage
