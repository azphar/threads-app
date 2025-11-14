import React from "react";

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
  const timeAgo = formatTimeAgo(thread.createdAt);

  function handleDeleteClick() {
    if (!onDelete) return;
    onDelete(thread.id);
  }

  return (
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
          >
            Delete
          </button>
        )}
      </div>
      <p className="thread-card__content">{thread.text}</p>
    </article>
  );
}

export default ThreadCard;
