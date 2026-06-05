import {
  APPWRITE_BOARD_BUCKET_ID,
  APPWRITE_BOARD_DATABASE_ID,
  APPWRITE_POST_COLLECTION_ID,
  APPWRITE_REPORT_COLLECTION_ID,
  ID,
  Query,
  boardDatabases,
  boardStorage,
} from "../appwrite";

const LIST_LIMIT = 100;

export async function listPosts({ currentUserId } = {}) {
  const response = await boardDatabases.listDocuments({
    databaseId: APPWRITE_BOARD_DATABASE_ID,
    collectionId: APPWRITE_POST_COLLECTION_ID,
    queries: [Query.orderDesc("$createdAt"), Query.limit(LIST_LIMIT)],
  });

  return response.documents.map((document) =>
    mapPostDocument(document, currentUserId),
  );
}

export async function createPost({ building, content, currentUser, imageFile, title }) {
  const imageId = imageFile ? await uploadPostImage(imageFile) : "";
  const authorName =
    currentUser?.profile?.nickname || currentUser?.name || "익명";
  const authorId = currentUser?.$id || "";

  const document = await boardDatabases.createDocument({
    databaseId: APPWRITE_BOARD_DATABASE_ID,
    collectionId: APPWRITE_POST_COLLECTION_ID,
    documentId: ID.unique(),
    data: {
      title,
      content,
      building,
      imageId,
      favoritedBy: serializeFavoriteIds([]),
      authorId,
      authorName,
    },
  });

  return mapPostDocument(document, authorId);
}

export async function updatePostFavorite({ currentUserId, post }) {
  if (!currentUserId) {
    throw new Error("로그인 후 이용해주세요.");
  }

  const favoriteIds = post.favoriteUserIds || [];
  const nextFavoriteIds = favoriteIds.includes(currentUserId)
    ? favoriteIds.filter((userId) => userId !== currentUserId)
    : [...favoriteIds, currentUserId];

  const document = await boardDatabases.updateDocument({
    databaseId: APPWRITE_BOARD_DATABASE_ID,
    collectionId: APPWRITE_POST_COLLECTION_ID,
    documentId: post.id,
    data: {
      favoritedBy: serializeFavoriteIds(nextFavoriteIds),
    },
  });

  return mapPostDocument(document, currentUserId);
}

export async function createReport({ reason, reporterId, targetId, targetType }) {
  return boardDatabases.createDocument({
    databaseId: APPWRITE_BOARD_DATABASE_ID,
    collectionId: APPWRITE_REPORT_COLLECTION_ID,
    documentId: ID.unique(),
    data: {
      targetType,
      targetId,
      reason,
      reporterId,
    },
  });
}

export function getPostImageUrl(imageId) {
  if (!imageId) return "";

  return boardStorage.getFileView({
    bucketId: APPWRITE_BOARD_BUCKET_ID,
    fileId: imageId,
  });
}

function mapPostDocument(document, currentUserId) {
  const favoriteUserIds = parseFavoriteIds(document.favoritedBy);

  return {
    id: document.$id,
    title: document.title || "",
    content: document.content || "",
    createdAt: document.$createdAt,
    likes: favoriteUserIds.length,
    comments: [],
    liked: currentUserId ? favoriteUserIds.includes(currentUserId) : false,
    image: getPostImageUrl(document.imageId),
    imageId: document.imageId || "",
    category: document.building || "",
    authorId: document.authorId || "",
    authorName: document.authorName || "익명",
    favoriteUserIds,
  };
}

async function uploadPostImage(file) {
  const uploadedFile = await boardStorage.createFile({
    bucketId: APPWRITE_BOARD_BUCKET_ID,
    fileId: ID.unique(),
    file,
  });

  return uploadedFile.$id;
}

function parseFavoriteIds(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsedValue = JSON.parse(value);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function serializeFavoriteIds(favoriteIds) {
  return favoriteIds;
}
