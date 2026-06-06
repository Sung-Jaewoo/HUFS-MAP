import "./PasswordToggleButton.css";

function PasswordToggleButton({ isVisible, onClick }) {
  return (
    <button
      aria-label={isVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
      className={isVisible ? "password-toggle visible" : "password-toggle"}
      onClick={onClick}
      type="button"
    >
      {isVisible ? (
        <svg aria-hidden="true" focusable="false" viewBox="0 0 28 24">
          <path d="M2.5 12c3.1-5 6.9-7.5 11.5-7.5S22.4 7 25.5 12c-.9 1.5-1.9 2.7-3 3.7" />
          <path d="M18.2 18.1c-1.3.6-2.7.9-4.2.9-4.6 0-8.4-2.3-11.5-7" />
          <path d="M10.9 8.8A4.4 4.4 0 0 1 18 12c0 .5-.1 1-.2 1.5" />
          <path d="M15.3 16.1A4.4 4.4 0 0 1 9.7 10.6" />
          <path d="M4 3.5 24 20.5" />
        </svg>
      ) : (
        <svg aria-hidden="true" focusable="false" viewBox="0 0 28 18">
          <path d="M2 9c3-5 7-7 12-7s9 2 12 7c-3 5-7 7-12 7S5 14 2 9Z" />
          <circle cx="14" cy="9" r="4" />
        </svg>
      )}
    </button>
  );
}

export default PasswordToggleButton;
