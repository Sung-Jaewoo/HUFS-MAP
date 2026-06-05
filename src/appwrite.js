import { Account, Client, Databases, ID, Query, Storage, TablesDB } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const boardClient = new Client()
  .setEndpoint(
    import.meta.env.VITE_APPWRITE_BOARD_ENDPOINT ||
      "https://fra.cloud.appwrite.io/v1",
  )
  .setProject(
    import.meta.env.VITE_APPWRITE_BOARD_PROJECT_ID ||
      "6a0bd3c70007637f5038",
  );

export const APPWRITE_DATABASE_ID =
  import.meta.env.VITE_APPWRITE_DATABASE_ID || "6a0421f70006ae3722a8";
export const APPWRITE_USERS_TABLE_ID =
  import.meta.env.VITE_APPWRITE_USERS_TABLE_ID || "users";
export const APPWRITE_BOARD_DATABASE_ID =
  import.meta.env.VITE_APPWRITE_BOARD_DATABASE_ID || "post";
export const APPWRITE_POST_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID || "post";
export const APPWRITE_REPORT_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_REPORT_COLLECTION_ID || "repost";
export const APPWRITE_BOARD_BUCKET_ID =
  import.meta.env.VITE_APPWRITE_BOARD_BUCKET_ID || "hufs-bucket";

export const account = new Account(client);
export const databases = new Databases(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);
export const boardDatabases = new Databases(boardClient);
export const boardStorage = new Storage(boardClient);
export { boardClient, client, ID, Query };
