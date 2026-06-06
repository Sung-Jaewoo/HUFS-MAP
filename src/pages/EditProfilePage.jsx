import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordToggleButton from "../components/PasswordToggleButton";
import { getCurrentUser, logout, updateUserProfile } from "../services/auth";
import { toKoreanErrorMessage } from "../services/errors";
import "./EditProfilePage.css";

const emptyForm = {
  username: "",
  nickname: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function EditProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [initialForm, setInitialForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        navigate("/login");
        return;
      }

      const profile = currentUser.profile || {};
      const loadedForm = {
        username: profile.username || "",
        nickname: profile.nickname || currentUser.name || "",
        email: profile.email || currentUser.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      };

      setUser(currentUser);
      setForm(loadedForm);
      setInitialForm(loadedForm);
      setIsLoading(false);
    };

    loadUser();
  }, [navigate]);

  const displayName = useMemo(
    () => form.nickname || user?.name || "사용자",
    [form.nickname, user?.name],
  );

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setMessage("");
  };

  const togglePasswordVisibility = (name) => {
    setPasswordVisibility((current) => ({
      ...current,
      [name]: !current[name],
    }));
  };

  const validateForm = () => {
    if (!/^[A-Za-z0-9]{4,20}$/.test(form.username)) {
      return "아이디는 영문, 숫자 조합 4~20자로 입력해주세요.";
    }

    if (form.nickname.trim().length < 2 || form.nickname.trim().length > 12) {
      return "닉네임은 2자 이상 12자 이하로 입력해주세요.";
    }

    const wantsPasswordChange =
      form.currentPassword || form.newPassword || form.confirmPassword;

    if (wantsPasswordChange) {
      if (!form.currentPassword) return "현재 비밀번호를 입력해주세요.";
      if (
        form.newPassword.length < 8 ||
        !/[A-Za-z]/.test(form.newPassword) ||
        !/[0-9]/.test(form.newPassword) ||
        !/[!@#$%^&*]/.test(form.newPassword)
      ) {
        return "새 비밀번호는 영문, 숫자, 특수문자 조합 8자 이상이어야 합니다.";
      }
      if (form.newPassword !== form.confirmPassword) {
        return "새 비밀번호 확인이 일치하지 않습니다.";
      }
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const error = validateForm();
    if (error) {
      setMessage(error);
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const updatedUser = await updateUserProfile({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        nickname: form.nickname,
        user,
        username: form.username,
      });

      const savedForm = {
        username: updatedUser.profile?.username || form.username,
        nickname: updatedUser.profile?.nickname || form.nickname,
        email: updatedUser.profile?.email || updatedUser.email || form.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      };

      setUser(updatedUser);
      setForm(savedForm);
      setInitialForm(savedForm);
      setMessage("회원 정보가 저장되었습니다.");
    } catch (error) {
      setMessage(toKoreanErrorMessage(error, "회원 정보를 저장하지 못했습니다."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    const changed =
      form.username !== initialForm.username ||
      form.nickname !== initialForm.nickname ||
      form.currentPassword ||
      form.newPassword ||
      form.confirmPassword;

    if (!changed || window.confirm("수정 중인 내용이 있습니다. 나가시겠습니까?")) {
      navigate("/mypage");
    }
  };

  const handleLogout = async () => {
    await logout().catch(() => {});
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="mypage">
        <main className="edit-main">
          <p>회원 정보를 불러오는 중입니다.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="mypage">
      <header className="top-nav">
        <Link to="/">메인페이지</Link>
        <Link to="/post">게시판</Link>
        <Link to="/mypage">마이페이지</Link>
        <button className="nav-logout" onClick={handleLogout} type="button">
          로그아웃
        </button>
      </header>

      <div className="mypage-layout">
        <aside className="mypage-sidebar">
          <ProfileSummary
            displayName={displayName}
            email={form.email}
            username={form.username}
          />

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
          <p>가입된 회원 정보를 확인하고 수정할 수 있습니다.</p>

          <form className="edit-card" onSubmit={handleSubmit}>
            <div className="edit-row">
              <label htmlFor="username">아이디</label>
              <input
                id="username"
                name="username"
                onChange={updateField}
                value={form.username}
              />
            </div>

            <div className="edit-row">
              <label htmlFor="nickname">닉네임</label>
              <input
                id="nickname"
                name="nickname"
                onChange={updateField}
                value={form.nickname}
              />
            </div>

            <div className="edit-row">
              <label htmlFor="email">이메일</label>
              <input id="email" name="email" readOnly value={form.email} />
            </div>

            <div className="edit-row password">
              <label htmlFor="currentPassword">비밀번호 변경</label>

              <div>
                <div className="password-input-wrap">
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    onChange={updateField}
                    placeholder="현재 비밀번호"
                    type={
                      passwordVisibility.currentPassword ? "text" : "password"
                    }
                    value={form.currentPassword}
                  />
                  <PasswordToggleButton
                    isVisible={passwordVisibility.currentPassword}
                    onClick={() => togglePasswordVisibility("currentPassword")}
                  />
                </div>
                <div className="password-input-wrap">
                  <input
                    name="newPassword"
                    onChange={updateField}
                    placeholder="새 비밀번호"
                    type={passwordVisibility.newPassword ? "text" : "password"}
                    value={form.newPassword}
                  />
                  <PasswordToggleButton
                    isVisible={passwordVisibility.newPassword}
                    onClick={() => togglePasswordVisibility("newPassword")}
                  />
                </div>
                <div className="password-input-wrap">
                  <input
                    name="confirmPassword"
                    onChange={updateField}
                    placeholder="새 비밀번호 확인"
                    type={
                      passwordVisibility.confirmPassword ? "text" : "password"
                    }
                    value={form.confirmPassword}
                  />
                  <PasswordToggleButton
                    isVisible={passwordVisibility.confirmPassword}
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  />
                </div>
                <p className="helper-text">
                  비밀번호를 바꾸지 않으려면 세 칸 모두 비워두면 됩니다.
                </p>
              </div>
            </div>

            {message && <p className="status-message">{message}</p>}

            <div className="edit-buttons">
              <button className="cancel-btn" onClick={handleCancel} type="button">
                취소
              </button>

              <button className="save-btn" disabled={isSaving} type="submit">
                {isSaving ? "저장 중" : "저장하기"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

function ProfileSummary({ displayName, email, username }) {
  return (
    <div className="side-profile">
      <div className="side-avatar">{displayName.slice(0, 1)}</div>

      <div>
        <strong>{displayName}</strong>
        <span>{username || "학생"}</span>
        <p>HUFS MAP 회원</p>
        <p>{email}</p>
      </div>
    </div>
  );
}

export default EditProfilePage;
