export function toKoreanErrorMessage(
  error,
  fallback = "요청을 처리하지 못했습니다.",
) {
  const code = error?.code;
  const message = error?.message || "";
  const lowerMessage = message.toLowerCase();

  if (message.includes("favoritedBy") && message.includes("array")) {
    return "즐겨찾기 데이터 형식이 서버 설정과 맞지 않습니다. 다시 시도해주세요.";
  }

  if (message.includes("Invalid document structure")) {
    return "서버 데이터 형식과 맞지 않는 값이 있습니다.";
  }

  if (message.includes("Missing required parameter")) {
    return "필수 입력값이 누락되었습니다.";
  }

  if (message.includes("Document with the requested ID could not be found")) {
    return "요청한 데이터를 찾을 수 없습니다.";
  }

  if (message.includes("User with the requested ID could not be found")) {
    return "가입 정보를 찾을 수 없습니다.";
  }

  if (
    message.includes("Invalid credentials") ||
    lowerMessage.includes("password") ||
    lowerMessage.includes("credentials")
  ) {
    return "아이디 또는 비밀번호가 올바르지 않습니다.";
  }

  if (
    message.includes("Creation of a session is prohibited") ||
    message.includes("session is active")
  ) {
    return "이미 로그인된 세션이 있습니다. 새로고침 후 다시 시도해주세요.";
  }

  if (
    code === 401 ||
    lowerMessage.includes("unauthorized") ||
    lowerMessage.includes("not authorized")
  ) {
    return "로그인이 필요하거나 권한이 없습니다.";
  }

  if (code === 404) {
    return "요청한 정보를 찾을 수 없습니다.";
  }

  if (code === 409 || lowerMessage.includes("already exists")) {
    return "이미 사용 중인 정보입니다.";
  }

  if (
    lowerMessage.includes("failed to fetch") ||
    lowerMessage.includes("network")
  ) {
    return "네트워크 연결을 확인해주세요.";
  }

  return fallback;
}
