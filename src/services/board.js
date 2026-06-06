import {
  APPWRITE_DATABASE_ID,
  APPWRITE_BOARD_BUCKET_ID,
  APPWRITE_BOARD_DATABASE_ID,
  APPWRITE_COMMENTS_COLLECTION_ID,
  APPWRITE_POST_COLLECTION_ID,
  APPWRITE_REPORT_COLLECTION_ID,
  APPWRITE_USERS_TABLE_ID,
  ID,
  Query,
  boardDatabases,
  boardStorage,
  tablesDB,
} from "../appwrite";

const LIST_LIMIT = 100;
const BUILDING_LABEL_BY_KEY = {
  baeknyeon: "백년관",
  dormitory: "기숙사",
  engineering: "공학관",
  humanities_economics: "인문경상관",
  language: "어문관",
  library: "중앙도서관",
  liberal_arts: "교양관",
  myeongsudang: "명수당",
  natural_science: "자연과학관",
  student_union: "학생회관",
  welfare: "후생관",
};
const BUILDING_KEY_BY_LABEL = Object.fromEntries(
  Object.entries(BUILDING_LABEL_BY_KEY).map(([key, label]) => [label, key]),
);
const BUILDING_DETAIL_BY_KEY = {
  baeknyeon: {
    category: "강의/학생지원",
    description: "학생 활동과 수업 공간이 함께 있는 건물입니다.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
  },
  dormitory: {
    category: "생활",
    description: "학생들이 거주하는 기숙사 공간입니다.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585",
  },
  engineering: {
    category: "강의/실험",
    description: "공학 계열 강의와 실험실이 있는 건물입니다.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
  },
  humanities_economics: {
    category: "강의",
    description: "인문, 경상 계열 수업이 진행되는 건물입니다.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
  },
  language: {
    category: "강의",
    description: "어문 계열 수업과 학습 공간이 있는 건물입니다.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
  },
  library: {
    category: "도서관",
    description: "자료 열람과 학습을 위한 중앙도서관입니다.",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2",
  },
  liberal_arts: {
    category: "강의",
    description: "교양 수업과 공통 강의가 진행되는 건물입니다.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  },
  myeongsudang: {
    category: "장소",
    description: "캠퍼스 안에서 위치를 확인할 수 있는 장소입니다.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  natural_science: {
    category: "강의/실험",
    description: "자연과학 계열 강의와 실험 공간이 있는 건물입니다.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
  },
  student_union: {
    category: "학생지원",
    description: "학생 복지와 편의 시설을 이용할 수 있는 건물입니다.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
  },
  welfare: {
    category: "편의시설",
    description: "학생 편의 시설과 휴게 공간이 있는 건물입니다.",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742",
  },
};

export async function listFavoriteBuildings({ profile, userId }) {
  if (!userId) return [];

  const userProfile = profile || (await getUserProfileRow(userId));

  return (userProfile.favoriteBuildings || [])
    .map((buildingKey) => BUILDING_LABEL_BY_KEY[buildingKey] || buildingKey)
    .filter(Boolean);
}

export async function listFavoriteBuildingCards({ userId }) {
  if (!userId) return [];

  const profile = await getUserProfileRow(userId);

  return (profile.favoriteBuildings || [])
    .map((buildingKey) => {
      const label = BUILDING_LABEL_BY_KEY[buildingKey] || buildingKey;
      const detail = BUILDING_DETAIL_BY_KEY[buildingKey] || {};

      return {
        id: buildingKey,
        buildingName: label,
        category: detail.category || "건물",
        description: detail.description || `${label} 위치를 확인할 수 있습니다.`,
        image:
          detail.image ||
          "https://images.unsplash.com/photo-1562774053-701939374585",
        name: label,
      };
    })
    .filter((building) => building.name);
}

export async function toggleFavoriteBuilding({ building, profile, userId }) {
  if (!userId) {
    throw new Error("로그인 후 이용해주세요.");
  }

  const userProfile = profile || (await getUserProfileRow(userId));
  const buildingKey = getBuildingKey(building);
  const favoriteBuildingKeys = userProfile.favoriteBuildings || [];
  const isFavorite = favoriteBuildingKeys.includes(buildingKey);
  const nextFavoriteBuildingKeys = isFavorite
    ? favoriteBuildingKeys.filter((key) => key !== buildingKey)
    : [...favoriteBuildingKeys, buildingKey];

  await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_USERS_TABLE_ID,
    rowId: userProfile.$id,
    data: {
      favoriteBuildings: nextFavoriteBuildingKeys,
    },
  });

  return {
    building,
    favoriteBuildings: nextFavoriteBuildingKeys,
    isFavorite: !isFavorite,
  };
}

export async function listPosts({ currentUserId } = {}) {
  const [postResponse, commentResponse] = await Promise.all([
    boardDatabases.listDocuments({
      databaseId: APPWRITE_BOARD_DATABASE_ID,
      collectionId: APPWRITE_POST_COLLECTION_ID,
      queries: [Query.orderDesc("$createdAt"), Query.limit(LIST_LIMIT)],
    }),
    boardDatabases.listDocuments({
      databaseId: APPWRITE_BOARD_DATABASE_ID,
      collectionId: APPWRITE_COMMENTS_COLLECTION_ID,
      queries: [Query.orderAsc("$createdAt"), Query.limit(500)],
    }),
  ]);

  const commentsByPostId = groupCommentsByPostId(
    commentResponse.documents,
    currentUserId,
  );

  return postResponse.documents.map((document) =>
    mapPostDocument(document, currentUserId, commentsByPostId[document.$id] || []),
  );
}

export async function listMyPosts({ currentUserId }) {
  if (!currentUserId) return [];

  const response = await boardDatabases.listDocuments({
    databaseId: APPWRITE_BOARD_DATABASE_ID,
    collectionId: APPWRITE_POST_COLLECTION_ID,
    queries: [
      Query.equal("authorId", currentUserId),
      Query.orderDesc("$createdAt"),
      Query.limit(LIST_LIMIT),
    ],
  });

  return response.documents.map((document) =>
    mapPostDocument(document, currentUserId, []),
  );
}

export async function deletePostDocument({ postId }) {
  return boardDatabases.deleteDocument({
    databaseId: APPWRITE_BOARD_DATABASE_ID,
    collectionId: APPWRITE_POST_COLLECTION_ID,
    documentId: postId,
  });
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

export async function createComment({
  content,
  currentUser,
  parentCommentId = "",
  postId,
}) {
  if (!currentUser) {
    throw new Error("로그인 후 댓글을 작성할 수 있습니다.");
  }

  const document = await boardDatabases.createDocument({
    databaseId: APPWRITE_BOARD_DATABASE_ID,
    collectionId: APPWRITE_COMMENTS_COLLECTION_ID,
    documentId: ID.unique(),
    data: {
      postId,
      content,
      authorId: currentUser.$id,
      authorName:
        currentUser.profile?.nickname || currentUser.name || currentUser.email || "익명",
      parentCommentId,
      likedBy: [],
      deleted: false,
    },
  });

  return mapCommentDocument(document, currentUser.$id);
}

export async function updateCommentLike({ comment, currentUserId }) {
  if (!currentUserId) {
    throw new Error("로그인 후 이용해주세요.");
  }

  const likedBy = comment.likedBy || [];
  const nextLikedBy = likedBy.includes(currentUserId)
    ? likedBy.filter((userId) => userId !== currentUserId)
    : [...likedBy, currentUserId];

  const document = await boardDatabases.updateDocument({
    databaseId: APPWRITE_BOARD_DATABASE_ID,
    collectionId: APPWRITE_COMMENTS_COLLECTION_ID,
    documentId: comment.id,
    data: {
      likedBy: nextLikedBy,
    },
  });

  return mapCommentDocument(document, currentUserId);
}

export async function deleteCommentDocument({ comment }) {
  const document = await boardDatabases.updateDocument({
    databaseId: APPWRITE_BOARD_DATABASE_ID,
    collectionId: APPWRITE_COMMENTS_COLLECTION_ID,
    documentId: comment.id,
    data: {
      deleted: true,
      likedBy: [],
    },
  });

  return mapCommentDocument(document, "");
}

export async function listMyComments({ currentUserId }) {
  if (!currentUserId) return [];

  const [commentResponse, postResponse] = await Promise.all([
    boardDatabases.listDocuments({
      databaseId: APPWRITE_BOARD_DATABASE_ID,
      collectionId: APPWRITE_COMMENTS_COLLECTION_ID,
      queries: [
        Query.equal("authorId", currentUserId),
        Query.orderDesc("$createdAt"),
        Query.limit(200),
      ],
    }),
    boardDatabases.listDocuments({
      databaseId: APPWRITE_BOARD_DATABASE_ID,
      collectionId: APPWRITE_POST_COLLECTION_ID,
      queries: [Query.limit(200)],
    }),
  ]);

  const postById = Object.fromEntries(
    postResponse.documents.map((document) => [document.$id, document]),
  );

  return commentResponse.documents.map((document) => {
    const comment = mapCommentDocument(document, currentUserId);
    const post = postById[comment.postId];

    return {
      ...comment,
      board: post?.building || "게시판",
      postDeleted: !post,
      postTitle: post?.title || "삭제된 게시글",
    };
  });
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

function mapPostDocument(document, currentUserId, comments = []) {
  const favoriteUserIds = parseFavoriteIds(document.favoritedBy);

  return {
    id: document.$id,
    title: document.title || "",
    content: document.content || "",
    createdAt: document.$createdAt,
    likes: favoriteUserIds.length,
    comments,
    liked: currentUserId ? favoriteUserIds.includes(currentUserId) : false,
    image: getPostImageUrl(document.imageId),
    imageId: document.imageId || "",
    category: document.building || "",
    authorId: document.authorId || "",
    authorName: document.authorName || "익명",
    favoriteUserIds,
  };
}

function groupCommentsByPostId(documents, currentUserId) {
  const commentsById = {};
  const commentsByPostId = {};

  documents.forEach((document) => {
    const comment = mapCommentDocument(document, currentUserId);
    commentsById[comment.id] = comment;
  });

  Object.values(commentsById).forEach((comment) => {
    if (comment.parentCommentId && commentsById[comment.parentCommentId]) {
      commentsById[comment.parentCommentId].replies.push(comment);
      return;
    }

    commentsByPostId[comment.postId] = commentsByPostId[comment.postId] || [];
    commentsByPostId[comment.postId].push(comment);
  });

  return commentsByPostId;
}

function mapCommentDocument(document, currentUserId) {
  const likedBy = parseFavoriteIds(document.likedBy);

  return {
    id: document.$id,
    postId: document.postId || "",
    parentCommentId: document.parentCommentId || "",
    author: document.authorName || "익명",
    authorId: document.authorId || "",
    content: document.content || "",
    likes: likedBy.length,
    liked: currentUserId ? likedBy.includes(currentUserId) : false,
    likedBy,
    deleted: Boolean(document.deleted),
    createdAt: document.$createdAt,
    replies: [],
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

async function getUserProfileRow(authUserId) {
  const response = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_USERS_TABLE_ID,
    queries: [Query.equal("authUserId", authUserId), Query.limit(1)],
  });

  const profile = response.rows?.[0];

  if (!profile) {
    throw new Error("사용자 정보를 찾을 수 없습니다.");
  }

  return profile;
}

function getBuildingKey(building) {
  return BUILDING_KEY_BY_LABEL[building] || building;
}
