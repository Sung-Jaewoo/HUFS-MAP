import {
  APPWRITE_DATABASE_ID,
  APPWRITE_USERS_TABLE_ID,
  ID,
  Query,
  account,
  tablesDB,
} from "../appwrite";

export async function sendSignupEmailToken({ email, username }) {
  await assertEmailAvailable(email);
  await assertUsernameAvailable(username);

  return account.createEmailToken({
    userId: ID.unique(),
    email,
    phrase: false,
  });
}

export async function verifySignupEmailToken({ userId, secret }) {
  return account.createSession({ userId, secret });
}

export async function signUp({ email, password, username, nickname }) {
  await assertEmailAvailable(email);
  await assertUsernameAvailable(username);

  await account.updateName({ name: nickname });
  await account.updatePassword({ password });

  const user = await account.get();

  try {
    await tablesDB.createRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_USERS_TABLE_ID,
      rowId: user.$id,
      data: {
        email,
        username,
        nickname,
        authUserId: user.$id,
      },
    });
  } catch (error) {
    await logout().catch(() => {});
    throw error;
  }

  return user;
}

export async function login({ emailOrUsername, email, password }) {
  const loginEmail = email || (await resolveLoginEmail(emailOrUsername));

  return account.createEmailPasswordSession({
    email: loginEmail,
    password,
  });
}

export async function logout() {
  return account.deleteSession({ sessionId: "current" });
}

export async function getCurrentUser() {
  try {
    const accountUser = await account.get();
    const profile = await getUserProfile(accountUser.$id).catch(() => null);

    return {
      ...accountUser,
      profile,
    };
  } catch {
    return null;
  }
}

export async function getUserProfile(authUserId) {
  const result = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_USERS_TABLE_ID,
    queries: [Query.equal("authUserId", authUserId), Query.limit(1)],
  });

  return result.rows?.[0] || null;
}

export async function assertUsernameAvailable(username) {
  const result = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_USERS_TABLE_ID,
    queries: [Query.equal("username", username), Query.limit(1)],
  });

  if (result.rows?.length) {
    throw new Error("이미 사용 중인 아이디입니다.");
  }
}

export async function assertEmailAvailable(email) {
  const result = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_USERS_TABLE_ID,
    queries: [Query.equal("email", email), Query.limit(1)],
  });

  if (result.rows?.length) {
    throw new Error("이미 가입된 이메일입니다.");
  }
}

async function resolveLoginEmail(emailOrUsername) {
  const value = emailOrUsername.trim();

  if (value.includes("@")) return value;

  const result = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_USERS_TABLE_ID,
    queries: [Query.equal("username", value), Query.limit(1)],
  });

  const profile = result.rows?.[0];

  if (!profile?.email) {
    throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
  }

  return profile.email;
}
