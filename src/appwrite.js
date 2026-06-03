import { Account, Client, Databases, ID, Query, Storage, TablesDB } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const APPWRITE_DATABASE_ID =
  import.meta.env.VITE_APPWRITE_DATABASE_ID || "6a0421f70006ae3722a8";
export const APPWRITE_USERS_TABLE_ID =
  import.meta.env.VITE_APPWRITE_USERS_TABLE_ID || "users";

export const account = new Account(client);
export const databases = new Databases(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);
export { client, ID, Query };
