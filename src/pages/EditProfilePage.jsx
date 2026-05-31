import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./EditProfilePage.css";

const currentUser = {
  name: "홍길동",
  role: "학생",
  department: "컴퓨터공학과",
  email: "honggildong@ooo.ac.kr",
};

function EditProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useStateFromUser();
  const [message, setMessage] = useStateMessage();

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setMessage("");
  };

  const validateForm = () => {
    if (!form.name.trim()) return "이름을 입력해 주세요.";
    if (!form.department.trim()) return "소속을 입력해 주세요.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "올바른 이메일 형식을 입력해 주세요.";
    }

    const wantsPasswordChange =
      form.currentPassword || form.newPassword || form.confirmPassword;

    if (wantsPasswordChange) {
      if (!form.currentPassword) return "현재 비밀번호를 입력해 주세요.";
      if (form.newPassword.length < 8) return "새 비밀번호는 8자 이상이어야 합니다.";
      if (form.newPassword !== form.confirmPassword) {
        return "새 비밀번호 확인이 일치하지 않습니다.";
      }
    }

    return "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const error = validateForm();
    if (error) {
      setMessage(error);
      return;
    }

    setMessage("저장 준비가 완료됐습니다. 백엔드 연동 시 이 값으로 PATCH 요청을 보내면 됩니다.");
  };

  const handleCancel = () => {
    const changed =
      form.name !== currentUser.name ||
      form.department !== currentUser.department ||
      form.email !== currentUser.email ||
      form.currentPassword ||
      form.newPassword ||
      form.confirmPassword;

    if (!changed || window.confirm("수정 중인 내용이 있습니다. 나가시겠습니까?")) {
      navigate("/mypage");
    }
  };

  return (
    <div className="mypage">
      <header className="top-nav">
        <Link to="/">캠퍼스맵</Link>
        <Link to="/post">게시판</Link>
        <Link to="/mypage">마이페이지</Link>
        <Link to="/">로그아웃</Link>
      </header>

      <div className="mypage-layout">
        <aside className="mypage-sidebar">
          <ProfileSummary />

          <Link className="side-menu active" to="/mypage/edit">
            회원 정보 수정
          </Link>
          <Link className="side-menu" to="/mypage/posts">
            내가 쓴 글
          </Link>
          <Link className="side-menu" to="/mypage/comments">
            내가 쓴 댓글
          </Link>
          <Link className="side-menu" to="/mypage/favorites">
            즐겨찾기
          </Link>
        </aside>

        <main className="edit-main">
          <h1>회원 정보 수정</h1>
          <p>백엔드 연동 전에도 입력값 검증과 저장 흐름을 확인할 수 있습니다.</p>

          <form className="edit-card" onSubmit={handleSubmit}>
            <div className="edit-row">
              <label htmlFor="name">이름</label>
              <input id="name" name="name" onChange={updateField} value={form.name} />
            </div>

            <div className="edit-row">
              <label htmlFor="department">소속</label>
              <input
                id="department"
                name="department"
                onChange={updateField}
                value={form.department}
              />
            </div>

            <div className="edit-row">
              <label htmlFor="email">이메일</label>
              <input id="email" name="email" onChange={updateField} value={form.email} />
            </div>

            <div className="edit-row password">
              <label htmlFor="currentPassword">비밀번호 변경</label>

              <div>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  onChange={updateField}
                  placeholder="현재 비밀번호"
                  type="password"
                  value={form.currentPassword}
                />
                <input
                  name="newPassword"
                  onChange={updateField}
                  placeholder="새 비밀번호 8자 이상"
                  type="password"
                  value={form.newPassword}
                />
                <input
                  name="confirmPassword"
                  onChange={updateField}
                  placeholder="새 비밀번호 확인"
                  type="password"
                  value={form.confirmPassword}
                />
                <p className="helper-text">비밀번호를 바꾸지 않으려면 세 칸 모두 비워두면 됩니다.</p>
              </div>
            </div>

            {message && <p className="status-message">{message}</p>}

            <div className="edit-buttons">
              <button className="cancel-btn" onClick={handleCancel} type="button">
                취소
              </button>

              <button className="save-btn" type="submit">
                저장하기
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

function ProfileSummary() {
  return (
    <div className="side-profile">
      <div className="side-avatar">홍</div>

      <div>
        <strong>{currentUser.name}</strong>
        <span>{currentUser.role}</span>
        <p>{currentUser.department}</p>
        <p>{currentUser.email}</p>
      </div>
    </div>
  );
}

function useStateFromUser() {
  return useState({
    name: currentUser.name,
    department: currentUser.department,
    email: currentUser.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
}

function useStateMessage() {
  return useState("");
}

export default EditProfilePage;
