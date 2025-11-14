import "./ThreadCard.css";
import React, { useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase/init.js";
import { useAuth } from "../context/AuthContext.jsx";
import CommentsModal from "./CommentsModal.jsx";

function formatTimeAgo(createdAt) {
  if (!createdAt || !createdAt.toDate) {
    return "";
  }

  const date = createdAt.toDate();
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  return date.toLocaleDateString();
}

function ThreadCard({ thread, canDelete, onDelete }) {
  const { user } = useAuth();
  const [commentsOpen, setCommentsOpen] = useState(false);

  const timeAgo = formatTimeAgo(thread.createdAt);

  const hasLiked =
    user &&
    Array.isArray(thread.likes) &&
    thread.likes.includes(user.uid);

  function handleDeleteClick() {
    if (!onDelete) return;
    onDelete(thread.id);
  }

  async function handleLike() {
    if (!user) return;

    const ref = doc(db, "threads", thread.id);

    try {
      await updateDoc(ref, {
        likes: hasLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  }

  return (
    <>
      <article className="thread-card">
        <div className="thread-card__header">
          <div className="thread-card__header-left">
            <span className="thread-card__author">{thread.authorEmail}</span>
            {timeAgo && (
              <span className="thread-card__time"> · {timeAgo}</span>
            )}
          </div>
          {canDelete && (
<button
  type="button"
  className="thread-card__delete"
  onClick={handleDeleteClick}
  aria-label="Delete"
>
  🗑️
</button>


          )}
        </div>

        <p className="thread-card__content">{thread.text}</p>

        <div className="thread-card__actions">
          <button
            type="button"
            className="thread-card__like"
            onClick={handleLike}
          >
            {hasLiked ? "Unlike" : "Like"}
          </button>

          <span className="thread-card__likes-count">
            {Array.isArray(thread.likes) ? thread.likes.length : 0}
          </span>

          <button
            type="button"
            className="thread-card__comment-btn"
            onClick={() => setCommentsOpen(true)}
          >
            Comments
          </button>
        </div>
      </article>

      {commentsOpen && (
        <CommentsModal
          threadId={thread.id}
          onClose={() => setCommentsOpen(false)}
        />
      )}
    </>
  );
}

export default ThreadCard;


