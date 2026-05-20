import { useEffect, useState } from "react";
import "./Postpage.css";

const text = {
  board: "게시판",
  write: "글쓰기",
  writePost: "게시글 작성",
  writeTitle: "제목을 입력하세요",
  writeContent: "글을 입력하세요",
  titleHelp: "(글자수 공백 포함 500자)",
  titleError: "제목을 입력해주세요.",
  lengthError:
    "글자수는 공백 포함 500자를 넘을 수 없습니다.",
  addPhoto: "사진 추가",
  submitPost: "등록하기",
  all: "전체",
  favorite: "즐겨찾기",
  likedPosts: "좋아한 게시물",
  likeLabel: "좋아요",
  commentLabel: "댓글",
  reply: "답글달기",
  replyPlaceholder: "답글을 입력하세요",
  commentTitle: "댓글 달기",
  commentPlaceholder: "댓글을 입력하세요",
  commentSubmit: "등록",
  commentWrite: "댓글 달기",
  commentLengthError:
    "댓글은 공백 포함 300자를 넘을 수 없습니다.",
  commentCancel: "취소",
  delete: "삭제",
  deletedComment: "삭제된 댓글입니다.",
  report: "신고하기",
  reportTitle: "게시물 신고하기",
  reportHelp: "신고 사유를 선택해주세요.",
  reportSubmit: "신고하기",
  reportDone: "신고 완료되었습니다",
  noComments: "아직 댓글이 없습니다.",
  noPosts: "아직 게시글이 없습니다.",
  noFavoriteBuildings: "즐겨찾기한 건물이 없습니다.",
  noLikedPosts: "좋아요한 게시물이 없습니다.",
  me: "나",
};

const icons = {
  menu: "☰",
  write: "✎",
  star: "☆",
  heart: "♡",
  back: "‹",
  check: "✓",
  arrow: "→",
};

const categories = [
  "백년관",
  "기숙사",
  "중앙도서관",
  "자연과학관",
  "공학관",
  "후생관",
  "학생회관",
  "어문관",
  "교양관",
  "인문경상관",
];

const reportReasons = [
  "불법촬영물 등의 유통",
  "낚시 /놀람/도배",
  "욕설/비하",
  "게시판 성격에 부적절함",
  "정당/정치인 비하 및 선거운동",
  "유출/사칭/사기",
  "상업적 광고 및 판매",
  "음란물/불건전한 만남 및 대화",
];

const COMMENT_LIMIT = 300;

const initialPosts = [];

function makeSampleDate(index) {
  const date = new Date();

  if (index >= 4) {
    date.setDate(date.getDate() - index);
  }

  return date.toISOString();
}

function formatPostDate(createdAt) {
  const date = new Date(createdAt);
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function Postpage() {
  const [view, setView] = useState("list");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [posts, setPosts] = useState(initialPosts);
  const [favoriteCategories, setFavoriteCategories] = useState([]);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [detailPostId, setDetailPostId] = useState(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [commentError, setCommentError] = useState("");
  const [detailCommentDraft, setDetailCommentDraft] = useState("");
  const [detailCommentError, setDetailCommentError] = useState("");
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [replyError, setReplyError] = useState("");
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportDraft, setReportDraft] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [postError, setPostError] = useState("");
  const [postDraft, setPostDraft] = useState({
    title: "",
    content: "",
    category: categories[1],
    image: null,
  });

  const resetPostDraft = (category) => {
    setPostDraft({
      title: "",
      content: "",
      category,
      image: null,
    });
  };

  useEffect(() => {
    window.history.replaceState(
      { view: "list", detailPostId: null, selectedCategory },
      "",
    );

    const handlePopState = (event) => {
      const state = event.state || {};

      setView(state.view || "list");
      setDetailPostId(state.detailPostId || null);
      setActiveCommentPostId(null);
      setCommentDraft("");
      setCommentError("");
      setDetailCommentDraft("");
      setDetailCommentError("");
      setReplyTargetId(null);
      setReplyDraft("");
      setReplyError("");
      setIsReportOpen(false);
      setReportDraft("");
      setReportMessage("");
      setPostError("");

      if (Object.prototype.hasOwnProperty.call(state, "selectedCategory")) {
        setSelectedCategory(state.selectedCategory);
      }

      if (state.view === "write") {
        resetPostDraft(state.selectedCategory || categories[1]);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const pushPageState = (nextState) => {
    window.history.pushState(nextState, "");
  };

  const toggleLike = (postId) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) return post;

        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        };
      }),
    );
  };

  const openCommentBox = (postId) => {
    setActiveCommentPostId(postId);
    setCommentDraft("");
    setCommentError("");
  };

  const closeCommentBox = () => {
    setActiveCommentPostId(null);
    setCommentDraft("");
    setCommentError("");
  };

  const updateCommentDraft = (value) => {
    const limitedValue = value.slice(0, COMMENT_LIMIT);

    setCommentDraft(limitedValue);
    setCommentError(value.length > COMMENT_LIMIT ? text.commentLengthError : "");
  };

  const submitComment = (event) => {
    event.preventDefault();

    if (!commentDraft.trim() || activeCommentPostId === null) return;

    if (commentDraft.length > COMMENT_LIMIT) {
      setCommentError(text.commentLengthError);
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === activeCommentPostId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Date.now(),
                  author: text.me,
                  content: commentDraft.trim(),
                  likes: 0,
                  liked: false,
                  replies: [],
                },
              ],
            }
          : post,
      ),
    );

    setCommentDraft("");
    setCommentError("");
  };

  const activePost = posts.find((post) => post.id === activeCommentPostId);
  const detailPost = posts.find((post) => post.id === detailPostId);
  const filteredPosts = posts
    .filter((post) =>
      selectedCategory ? post.category === selectedCategory : true,
    )
    .sort((firstPost, secondPost) =>
      new Date(secondPost.createdAt) - new Date(firstPost.createdAt),
    );
  const likedPosts = posts.filter((post) => post.liked);
  const recentPosts = posts
    .filter((post) => post.category === postDraft.category)
    .slice(0, 3);
  const detailRelatedPosts = detailPost
    ? posts
        .filter(
          (post) =>
            post.category === detailPost.category && post.id !== detailPost.id,
        )
        .slice(0, 3)
    : [];

  const openWritePage = () => {
    resetPostDraft(selectedCategory || categories[1]);
    setPostError("");
    pushPageState({
      view: "write",
      detailPostId: null,
      selectedCategory,
    });
    setView("write");
    setIsSidebarOpen(false);
  };

  const openBoardPage = () => {
    setSelectedCategory(null);
    pushPageState({
      view: "list",
      detailPostId: null,
      selectedCategory: null,
    });
    setView("list");
    setIsSidebarOpen(false);
  };

  const openFavoriteBuildingsPage = () => {
    pushPageState({
      view: "favorites",
      detailPostId: null,
      selectedCategory,
    });
    setView("favorites");
    setIsSidebarOpen(false);
  };

  const openLikedPostsPage = () => {
    pushPageState({
      view: "likedPosts",
      detailPostId: null,
      selectedCategory,
    });
    setView("likedPosts");
    setIsSidebarOpen(false);
  };

  const openCategoryFromFavorites = (category) => {
    setSelectedCategory(category);
    pushPageState({
      view: "list",
      detailPostId: null,
      selectedCategory: category,
    });
    setView("list");
  };

  const toggleFavoriteCategory = (category) => {
    setFavoriteCategories((currentCategories) =>
      currentCategories.includes(category)
        ? currentCategories.filter((item) => item !== category)
        : [...currentCategories, category],
    );
  };

  const toggleSelectedCategory = (category) => {
    setSelectedCategory((currentCategory) =>
      currentCategory === category ? null : category,
    );
  };

  const openDetailPage = (postId) => {
    setDetailPostId(postId);
    setDetailCommentDraft("");
    setDetailCommentError("");
    setReplyTargetId(null);
    setReplyDraft("");
    setReplyError("");
    setIsReportOpen(false);
    setReportDraft("");
    setReportMessage("");
    pushPageState({
      view: "detail",
      detailPostId: postId,
      selectedCategory,
    });
    setView("detail");
  };

  const closeDetailPage = () => {
    setDetailPostId(null);
    setDetailCommentDraft("");
    setDetailCommentError("");
    setReplyTargetId(null);
    setReplyDraft("");
    setReplyError("");
    setIsReportOpen(false);
    setReportDraft("");
    setReportMessage("");
    pushPageState({
      view: "list",
      detailPostId: null,
      selectedCategory,
    });
    setView("list");
  };

  const closeWritePage = () => {
    setPostError("");
    pushPageState({
      view: "list",
      detailPostId: null,
      selectedCategory,
    });
    setView("list");
  };

  const changeDraftImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setPostDraft((draft) => ({
      ...draft,
      image: URL.createObjectURL(file),
    }));
  };

  const submitPost = (event) => {
    event?.preventDefault();

    if (!postDraft.title.trim()) {
      setPostError(text.titleError);
      return;
    }

    if (postDraft.title.length + postDraft.content.length > 500) {
      setPostError(text.lengthError);
      return;
    }

    const newPost = {
      id: Date.now(),
      title: postDraft.title.trim(),
      content: postDraft.content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      liked: false,
      image: postDraft.image,
      category: postDraft.category,
    };

    setPosts((currentPosts) => [newPost, ...currentPosts]);
    setSelectedCategory(postDraft.category);
    setPostDraft({
      title: "",
      content: "",
      category: postDraft.category,
      image: null,
    });
    setPostError("");
    pushPageState({
      view: "list",
      detailPostId: null,
      selectedCategory: postDraft.category,
    });
    setView("list");
  };

  const submitDetailComment = (event) => {
    event.preventDefault();

    if (!detailCommentDraft.trim() || detailPostId === null) return;

    if (detailCommentDraft.length > COMMENT_LIMIT) {
      setDetailCommentError(text.commentLengthError);
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === detailPostId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Date.now(),
                  author: text.me,
                  content: detailCommentDraft.trim(),
                  likes: 0,
                  liked: false,
                  replies: [],
                },
              ],
            }
          : post,
      ),
    );

    setDetailCommentDraft("");
    setDetailCommentError("");
  };

  const updateDetailCommentDraft = (value) => {
    const limitedValue = value.slice(0, COMMENT_LIMIT);

    setDetailCommentDraft(limitedValue);
    setDetailCommentError(
      value.length > COMMENT_LIMIT ? text.commentLengthError : "",
    );
  };

  const toggleCommentLike = (commentId) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === detailPostId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      liked: !comment.liked,
                      likes: comment.liked
                        ? Math.max((comment.likes || 0) - 1, 0)
                        : (comment.likes || 0) + 1,
                    }
                  : comment,
              ),
            }
          : post,
      ),
    );
  };

  const openReplyForm = (commentId) => {
    setReplyTargetId((currentId) => (currentId === commentId ? null : commentId));
    setReplyDraft("");
    setReplyError("");
  };

  const updateReplyDraft = (value) => {
    const limitedValue = value.slice(0, COMMENT_LIMIT);

    setReplyDraft(limitedValue);
    setReplyError(value.length > COMMENT_LIMIT ? text.commentLengthError : "");
  };

  const submitReply = (event, commentId) => {
    event.preventDefault();

    if (!replyDraft.trim() || detailPostId === null) return;

    if (replyDraft.length > COMMENT_LIMIT) {
      setReplyError(text.commentLengthError);
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === detailPostId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      replies: [
                        ...(comment.replies || []),
                        {
                          id: Date.now(),
                          author: text.me,
                          content: replyDraft.trim(),
                          likes: 0,
                          liked: false,
                          deleted: false,
                        },
                      ],
                    }
                  : comment,
              ),
            }
          : post,
      ),
    );

    setReplyTargetId(null);
    setReplyDraft("");
    setReplyError("");
  };

  const deleteComment = (commentId) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === detailPostId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      deleted: true,
                      liked: false,
                      likes: 0,
                    }
                  : comment,
              ),
            }
          : post,
      ),
    );
  };

  const deleteReply = (commentId, replyId) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === detailPostId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      replies: (comment.replies || []).map((reply) =>
                        reply.id === replyId
                          ? {
                              ...reply,
                              deleted: true,
                              liked: false,
                              likes: 0,
                            }
                          : reply,
                      ),
                    }
                  : comment,
              ),
            }
          : post,
      ),
    );
  };

  const toggleReplyLike = (commentId, replyId) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === detailPostId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      replies: (comment.replies || []).map((reply) =>
                        reply.id === replyId
                          ? {
                              ...reply,
                              liked: !reply.liked,
                              likes: reply.liked
                                ? Math.max((reply.likes || 0) - 1, 0)
                                : (reply.likes || 0) + 1,
                            }
                          : reply,
                      ),
                    }
                  : comment,
              ),
            }
          : post,
      ),
    );
  };

  const openReportPopup = () => {
    setReportDraft("");
    setReportMessage("");
    setIsReportOpen(true);
  };

  const closeReportPopup = () => {
    setIsReportOpen(false);
    setReportDraft("");
    setReportMessage("");
  };

  const submitReport = (event) => {
    event.preventDefault();

    if (!reportDraft) {
      setReportMessage(text.reportHelp);
      return;
    }

    setReportDraft("");
    setReportMessage(text.reportDone);

    window.setTimeout(() => {
      setIsReportOpen(false);
      setReportMessage("");
    }, 2500);
  };

  return (
    <div className={isSidebarOpen ? "postPage sidebarOpen" : "postPage"}>
      <aside className={isSidebarOpen ? "sideBar open" : "sideBar"}>
        <button
          className="menuButton"
          type="button"
          onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
        >
          {icons.menu}
        </button>

        {isSidebarOpen && (
          <div className="sideTools">
            <button
              className="writeButton sideWriteItem"
              type="button"
              onClick={openWritePage}
            >
              <span>{icons.write}</span>
              <p>{text.write}</p>
            </button>

            <button
              className="sideItem"
              type="button"
              onClick={openBoardPage}
            >
              <StackedPostsIcon />
              <p>{text.all}</p>
            </button>

            <button
              className="sideItem"
              type="button"
              onClick={openFavoriteBuildingsPage}
            >
              <span>{icons.star}</span>
              <p>{text.favorite}</p>
            </button>

            <button
              className="sideItem"
              type="button"
              onClick={openLikedPostsPage}
            >
              <span>{icons.heart}</span>
              <p>{text.likedPosts}</p>
            </button>
          </div>
        )}
      </aside>

      <main className="board">
        {view === "write" ? (
          <WritePostView
            postDraft={postDraft}
            setPostDraft={setPostDraft}
            recentPosts={recentPosts}
            error={postError}
            setError={setPostError}
            onBack={closeWritePage}
            onImageChange={changeDraftImage}
            onSubmit={submitPost}
          />
        ) : view === "detail" && detailPost ? (
          <DetailPostView
            commentDraft={detailCommentDraft}
            commentError={detailCommentError}
            onBack={closeDetailPage}
            onCommentChange={updateDetailCommentDraft}
            onCommentSubmit={submitDetailComment}
            onCommentLike={toggleCommentLike}
            onCommentDelete={deleteComment}
            onLike={toggleLike}
            onReportOpen={openReportPopup}
            onReplyChange={updateReplyDraft}
            onReplyDelete={deleteReply}
            onReplyLike={toggleReplyLike}
            onReplyOpen={openReplyForm}
            onReplySubmit={submitReply}
            post={detailPost}
            relatedPosts={detailRelatedPosts}
            replyDraft={replyDraft}
            replyError={replyError}
            replyTargetId={replyTargetId}
          />
        ) : view === "favorites" ? (
          <FavoriteBuildingsView
            favoriteCategories={favoriteCategories}
            onSelectCategory={openCategoryFromFavorites}
          />
        ) : view === "likedPosts" ? (
          <LikedPostsView
            likedPosts={likedPosts}
            onLike={toggleLike}
            onOpenDetail={openDetailPage}
          />
        ) : (
          <>
            <h1>{text.board}</h1>

            <div className="categoryList">
              {categories.map((category) => {
                const isFavorite = favoriteCategories.includes(category);

                return (
                  <div className="categoryChip" key={category}>
                    <button
                      className={`categoryButton ${
                        selectedCategory === category ? "selected" : ""
                      }`}
                      type="button"
                      onClick={() => toggleSelectedCategory(category)}
                    >
                      {selectedCategory === category && <span>{icons.check}</span>}
                      {category}
                    </button>
                    <button
                      className={`categoryFavoriteButton ${
                        isFavorite ? "active" : ""
                      }`}
                      type="button"
                      onClick={() => toggleFavoriteCategory(category)}
                      aria-label={`${category} 즐겨찾기`}
                    >
                      {isFavorite ? "★" : icons.star}
                    </button>
                  </div>
                );
              })}
            </div>

            {filteredPosts.length > 0 ? (
              <section className="postGrid">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={toggleLike}
                    onOpenDetail={openDetailPage}
                  />
                ))}
              </section>
            ) : (
              <div className="emptyPosts">{text.noPosts}</div>
            )}

          </>
        )}

        {activePost && (
          <div className="commentOverlay" onClick={closeCommentBox}>
            <form
              className="commentBox"
              onClick={(event) => event.stopPropagation()}
              onSubmit={submitComment}
            >
              <div className="commentBoxHeader">
                <strong>{activePost.title}</strong>
                <span>{text.commentTitle}</span>
              </div>

              <div className="commentList">
                {activePost.comments.length > 0 ? (
                  activePost.comments.map((comment) => (
                    <div className="commentItem" key={comment.id}>
                      <div className="commentAvatar">
                        {comment.author.slice(0, 1)}
                      </div>
                      <div className="commentText">
                        <strong>{comment.author}</strong>
                        <p>{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="emptyComments">{text.noComments}</p>
                )}
              </div>

              <textarea
                value={commentDraft}
                onChange={(event) => updateCommentDraft(event.target.value)}
                placeholder={text.commentPlaceholder}
              />

              <div
                className={
                  commentError ? "lengthInfo commentLengthInfo error" : "lengthInfo commentLengthInfo"
                }
              >
                <span>{commentDraft.length}/{COMMENT_LIMIT}</span>
                {commentError && <strong>{commentError}</strong>}
              </div>

              <div className="commentBoxActions">
                <button type="button" onClick={closeCommentBox}>
                  {text.commentCancel}
                </button>
                <button type="submit">{text.commentSubmit}</button>
              </div>
            </form>
          </div>
        )}

        {isReportOpen && (
          <div className="commentOverlay" onClick={closeReportPopup}>
            <form
              className="reportBox"
              onClick={(event) => event.stopPropagation()}
              onSubmit={submitReport}
            >
              {reportMessage === text.reportDone ? (
                <div className="reportCompleteContent">
                  <FlagIcon />
                  <strong>{text.reportDone}</strong>
                </div>
              ) : (
                <>
                  <div className="reportBoxHeader">
                    <FlagIcon />
                    <strong>{text.reportTitle}</strong>
                  </div>

                  <p className="reportHelp">{text.reportHelp}</p>

                  <div className="reportReasonList">
                    {reportReasons.map((reason) => (
                      <button
                        className={
                          reportDraft === reason
                            ? "reportReasonButton selected"
                            : "reportReasonButton"
                        }
                        type="button"
                        key={reason}
                        onClick={() => setReportDraft(reason)}
                      >
                        {reportDraft === reason && <span>{icons.check}</span>}
                        {reason}
                      </button>
                    ))}
                  </div>

                  {reportMessage && <p className="reportMessage">{reportMessage}</p>}

                  <div className="commentBoxActions">
                    <button type="button" onClick={closeReportPopup}>
                      {text.commentCancel}
                    </button>
                    <button type="submit">{text.reportSubmit}</button>
                  </div>
                </>
              )}
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

function FavoriteBuildingsView({ favoriteCategories, onSelectCategory }) {
  return (
    <section className="favoritePage">
      <h1>{text.favorite}</h1>

      {favoriteCategories.length > 0 ? (
        <div className="favoriteBuildingList">
          {favoriteCategories.map((category) => (
            <button
              className="favoriteBuildingItem"
              type="button"
              key={category}
              onClick={() => onSelectCategory(category)}
            >
              <span>{icons.star}</span>
              <strong>{category}</strong>
              <span>{icons.arrow}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="emptyPosts">{text.noFavoriteBuildings}</div>
      )}
    </section>
  );
}

function LikedPostsView({ likedPosts, onLike, onOpenDetail }) {
  return (
    <section className="likedPostsPage">
      <h1>{text.likedPosts}</h1>

      {likedPosts.length > 0 ? (
        <section className="postGrid">
          {likedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={onLike}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </section>
      ) : (
        <div className="emptyPosts">{text.noLikedPosts}</div>
      )}
    </section>
  );
}

function PostCard({
  post,
  onLike,
  onOpenDetail,
  compact = false,
}) {
  return (
    <article className={compact ? "postCard compactPostCard" : "postCard"}>
      {compact ? (
        <Thumbnail image={post.image} title={post.title} />
      ) : (
        <button
          className="thumbnailButton"
          type="button"
          onClick={() => onOpenDetail(post.id)}
        >
          <Thumbnail image={post.image} title={post.title} />
        </button>
      )}

      <div className="postInfo">
        <strong>{post.title}</strong>
        {!compact && (
          <div className="postStats">
            <button
              className={`statItem statButton heartButton ${
                post.liked ? "liked" : ""
              }`}
              type="button"
              onClick={() => onLike(post.id)}
            >
              <HeartIcon />
              {post.likes}
            </button>
            <span className="statItem">
              <span className="commentIcon" />
              {post.comments.length}
            </span>
          </div>
        )}
      </div>

      <p>{formatPostDate(post.createdAt)}</p>
    </article>
  );
}

function DetailPostView({
  commentDraft,
  commentError,
  onCommentDelete,
  onCommentLike,
  onCommentChange,
  onCommentSubmit,
  onLike,
  onReportOpen,
  onReplyChange,
  onReplyDelete,
  onReplyLike,
  onReplyOpen,
  onReplySubmit,
  post,
  relatedPosts,
  replyDraft,
  replyError,
  replyTargetId,
}) {
  return (
    <section className="detailPage">
      <div className="detailHeader">
        <h1>
          {post.category} {text.board}
        </h1>
      </div>

      <article className="detailPost">
        <div className="detailImage">
          <Thumbnail image={post.image} title={post.title} />
        </div>

        <div className="detailBody">
          <h2>{post.title}</h2>
          <div className="detailAuthor">
            <span>{text.me}</span>
            <p>{text.me}</p>
          </div>
          <p>{post.content || text.writeContent}</p>
        </div>
      </article>

      <div className="detailActions">
        <button
          className={`statItem statButton heartButton ${
            post.liked ? "liked" : ""
          }`}
          type="button"
          onClick={() => onLike(post.id)}
        >
          <HeartIcon />
          <span>{text.likeLabel}</span>
          {post.likes}
        </button>
        <span className="statItem">
          <span className="commentIcon" />
          <span>{text.commentLabel}</span>
          {post.comments.length}
        </span>
        <button className="reportButton" type="button" onClick={onReportOpen}>
          <FlagIcon />
          <span>{text.report}</span>
        </button>
      </div>

      <section className="detailComments">
        <h2>
          {'\uB313\uAE00'}
          {post.comments.length}
        </h2>

        <div className="detailCommentList">
          {post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div className="commentItem" key={comment.id}>
                <div className="commentAvatar">
                  {comment.deleted ? "-" : comment.author.slice(0, 1)}
                </div>
                <div className="commentText">
                  {comment.deleted ? (
                    <>
                      <strong className="deletedAuthor">(삭제)</strong>
                      <p className="deletedCommentText">{text.deletedComment}</p>
                    </>
                  ) : (
                    <>
                      <strong>{comment.author}</strong>
                      <p>{comment.content}</p>

                      <div className="commentActions">
                        <button
                          className={
                            comment.liked
                              ? "commentLikeButton liked"
                              : "commentLikeButton"
                          }
                          type="button"
                          onClick={() => onCommentLike(comment.id)}
                        >
                          <HeartIcon />
                          {text.likeLabel} {comment.likes || 0}
                        </button>
                        <button type="button" onClick={() => onReplyOpen(comment.id)}>
                          <span className="commentIcon miniCommentIcon" />
                          {text.reply}
                        </button>
                        <button type="button" onClick={onReportOpen}>
                          <FlagIcon />
                          {text.report}
                        </button>
                        <button type="button" onClick={() => onCommentDelete(comment.id)}>
                          {text.delete}
                        </button>
                      </div>
                    </>
                  )}

                  {(comment.replies || []).length > 0 && (
                    <div className="replyList">
                      {(comment.replies || []).map((reply) => (
                        <div className="replyItem" key={reply.id}>
                          <div className="commentAvatar">
                            {reply.deleted ? "-" : reply.author.slice(0, 1)}
                          </div>
                          <div className="commentText">
                            {reply.deleted ? (
                              <>
                                <strong className="deletedAuthor">(삭제)</strong>
                                <p className="deletedCommentText">
                                  {text.deletedComment}
                                </p>
                              </>
                            ) : (
                              <>
                                <strong>{reply.author}</strong>
                                <p>{reply.content}</p>
                                <div className="commentActions">
                                  <button
                                    className={
                                      reply.liked
                                        ? "commentLikeButton liked"
                                        : "commentLikeButton"
                                    }
                                    type="button"
                                    onClick={() =>
                                      onReplyLike(comment.id, reply.id)
                                    }
                                  >
                                    <HeartIcon />
                                    {text.likeLabel} {reply.likes || 0}
                                  </button>
                                  <button type="button" onClick={onReportOpen}>
                                    <FlagIcon />
                                    {text.report}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onReplyDelete(comment.id, reply.id)
                                    }
                                  >
                                    {text.delete}
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!comment.deleted && replyTargetId === comment.id && (
                    <form
                      className="replyForm"
                      onSubmit={(event) => onReplySubmit(event, comment.id)}
                    >
                      <textarea
                        value={replyDraft}
                        onChange={(event) => onReplyChange(event.target.value)}
                        placeholder={text.replyPlaceholder}
                      />
                      <div
                        className={
                          replyError
                            ? "lengthInfo commentLengthInfo error"
                            : "lengthInfo commentLengthInfo"
                        }
                      >
                        <span>{replyDraft.length}/{COMMENT_LIMIT}</span>
                        {replyError && <strong>{replyError}</strong>}
                      </div>
                      <button type="submit">{text.commentSubmit}</button>
                    </form>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="emptyComments">{text.noComments}</p>
          )}
        </div>

        <form className="detailCommentForm" onSubmit={onCommentSubmit}>
          <div className="detailCommentInputArea">
            <textarea
              value={commentDraft}
              onChange={(event) => onCommentChange(event.target.value)}
              placeholder={text.commentPlaceholder}
            />
            <div
              className={
                commentError
                  ? "lengthInfo commentLengthInfo error"
                  : "lengthInfo commentLengthInfo"
              }
            >
              <span>{commentDraft.length}/{COMMENT_LIMIT}</span>
              {commentError && <strong>{commentError}</strong>}
            </div>
          </div>
          <button type="submit">{text.commentWrite}</button>
        </form>

        <section className="detailRelatedPosts">
          <h2>
            {post.category} {text.board}
            <span>{icons.arrow}</span>
          </h2>

          {relatedPosts.map((relatedPost) => (
            <PostCard compact key={relatedPost.id} post={relatedPost} />
          ))}
        </section>
      </section>
    </section>
  );
}

function WritePostView({
  postDraft,
  setPostDraft,
  recentPosts,
  error,
  setError,
  onImageChange,
  onSubmit,
}) {
  const currentLength = postDraft.title.length + postDraft.content.length;
  const isOverLimit = currentLength > 500;

  const updateTitle = (nextTitle) => {
    const allowedLength = 500 - postDraft.content.length;
    const limitedTitle = nextTitle.slice(0, Math.max(allowedLength, 0));

    setPostDraft({
      ...postDraft,
      title: limitedTitle,
    });

    setError(nextTitle.length > allowedLength ? text.lengthError : "");
  };

  const updateContent = (nextContent) => {
    const allowedLength = 500 - postDraft.title.length;
    const limitedContent = nextContent.slice(0, Math.max(allowedLength, 0));

    setPostDraft({
      ...postDraft,
      content: limitedContent,
    });

    setError(nextContent.length > allowedLength ? text.lengthError : "");
  };

  return (
    <form className="writePage" onSubmit={onSubmit}>
      <div className="writeHeader">
        <h1>{text.writePost}</h1>
      </div>

      <div className="writeBody">
        <label className="photoUpload">
          {postDraft.image ? (
            <img src={postDraft.image} alt={text.addPhoto} />
          ) : (
            <span>{text.addPhoto}</span>
          )}
          <input accept="image/*" type="file" onChange={onImageChange} />
        </label>

        <div className="writeFields">
          <input
            className="titleInput"
            maxLength={500}
            value={postDraft.title}
            onChange={(event) => updateTitle(event.target.value)}
            placeholder={text.writeTitle}
          />
          <p>{text.titleHelp}</p>

          <textarea
            className="contentInput"
            value={postDraft.content}
            onChange={(event) => updateContent(event.target.value)}
            placeholder={text.writeContent}
          />

          <div className={isOverLimit ? "lengthInfo error" : "lengthInfo"}>
            <span>{currentLength}/500</span>
            {(error || isOverLimit) && (
              <strong>{error || text.lengthError}</strong>
            )}
          </div>

          <select
            className="categorySelect"
            value={postDraft.category}
            onChange={(event) =>
              setPostDraft((draft) => ({
                ...draft,
                category: event.target.value,
              }))
            }
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <button
          className="submitPostButton"
          type="button"
          onClick={onSubmit}
        >
          {text.submitPost}
        </button>
      </div>

      <section className="writePreviewList">
        <h2>
          {postDraft.category} {text.board}
          <span>{icons.arrow}</span>
        </h2>

        {recentPosts.map((post) => (
          <PostCard compact key={post.id} post={post} />
        ))}
      </section>
    </form>
  );
}

function Thumbnail({ image, title }) {
  return (
    <div className="thumbnail">
      {image ? (
        <img src={image} alt={title} />
      ) : (
        <div className="placeholder">
          <div className="shapeCircle" />
          <div className="shapeTriangle" />
          <div className="shapeSquare" />
        </div>
      )}
    </div>
  );
}

function HeartIcon() {
  return (
    <svg
      className="heartIcon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg
      className="flagIcon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 21V4" />
      <path d="M5 5.5c4.3-2.4 7.1 1.9 11.5.2 1-.4 1.8-.9 2.5-1.5v10.4c-.8.7-1.8 1.2-3 1.5-4.1 1-6.9-2.9-11 .1" />
    </svg>
  );
}

function StackedPostsIcon() {
  return (
    <svg
      className="sideSvgIcon"
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 4h13a3 3 0 0 1 3 3v17" />
      <path d="M8 8h13a3 3 0 0 1 3 3v17" />
      <rect x="4" y="12" width="17" height="16" rx="3" />
      <path d="M8 16h9" />
      <path d="M8 19.5h9" />
      <path d="M8 23h9" />
    </svg>
  );
}

export default Postpage;
