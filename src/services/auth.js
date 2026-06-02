import { ID } from "appwrite";
import { account } from "../appwrite";

export async function signUp({ email, password, name }) {
  return account.create(ID.unique(), email, password, name);
}

export async function login({ email, password }) {
  return account.createEmailPasswordSession(email, password);
}

export async function logout() {
  return account.deleteSession("current");
}

export async function getCurrentUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}
