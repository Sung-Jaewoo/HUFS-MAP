import {
  APPWRITE_DATABASE_ID,
  APPWRITE_USERS_TABLE_ID,
  ID,
  Query,
  account,
  functions,
  tablesDB,
} from "../appwrite";

export async function sendSignupEmailToken({ email }) {
  await assertEmailAvailable(email);

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
  await assertUsernameAvailable(username);

  await account.updateName({ name: nickname });
  await account.updatePassword({ password });

  const user = await account.get();

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

  return user;
}

export async function login({ emailOrUsername, email, password }) {
  const loginEmail = email || (await resolveLoginEmail(emailOrUsername));

  await logout().catch(() => {});

  return account.createEmailPasswordSession({
    email: loginEmail,
    password,
  });
}

export async function logout() {
  return account.deleteSession({ sessionId: "current" });
}

export async function deleteCurrentUser(userId) {
  return functions.createExecution({
    functionId: "delete-user",
    body: JSON.stringify({ userId }),
    async: false,
  });
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

export async function updateUserProfile({
  currentPassword,
  newPassword,
  nickname,
  user,
  username,
}) {
  const nextNickname = nickname.trim();
  const nextUsername = username.trim();

  await assertUsernameAvailable(nextUsername, user.$id);
  await account.updateName({ name: nextNickname });

  if (newPassword) {
    await account.updatePassword({
      password: newPassword,
      oldPassword: currentPassword,
    });
  }

  const profile = await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_USERS_TABLE_ID,
    rowId: user.profile?.$id || user.$id,
    data: {
      email: user.email,
      username: nextUsername,
      nickname: nextNickname,
      authUserId: user.$id,
    },
  });

  return {
    ...(await account.get()),
    profile,
  };
}

export async function assertUsernameAvailable(username, currentAuthUserId = "") {
  const result = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_USERS_TABLE_ID,
    queries: [Query.equal("username", username), Query.limit(1)],
  });

  const duplicatedRow = result.rows?.find(
    (row) => row.authUserId !== currentAuthUserId,
  );

  if (duplicatedRow) {
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
